import { useState, useEffect } from "react";
import useLocationData from "../../../Hooks/useLocationData";

const API_URL = `${process.env.REACT_APP_API}/api/addresses`;

const useAddressForm = () => {
  const { provinces, amphures, tambons } = useLocationData();
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedAmphure, setSelectedAmphure] = useState(null);
  const [selectedTambon, setSelectedTambon] = useState(null);
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    addressLine: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
  });

  // ✅ โหลดที่อยู่จาก backend เมื่อ component โหลด
  useEffect(() => {
    fetchAddresses();
  }, []);

  // ✅ ตรวจสอบข้อมูลที่โหลด
  useEffect(() => {}, [provinces, amphures, tambons]);

  // ✅ ดึงข้อมูลที่อยู่จาก API
  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/addresses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setAddresses(data.data);
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
    }
  };

  const filteredAmphures = Array.isArray(amphures?.data)
    ? amphures.data.filter(
        (a) => String(a.province_id) === String(selectedProvince?.id)
      )
    : [];

  const filteredTambons = Array.isArray(tambons?.data)
    ? tambons.data.filter(
        (t) => String(t.amphure_id) === String(selectedAmphure?.id)
      )
    : [];

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.value);
    setSelectedAmphure(null);
    setSelectedTambon(null);
    setNewAddress({
      ...newAddress,
      province: e.value.name_th,
      district: "",
      subdistrict: "",
      postalCode: "",
    });
  };

  const handleAmphureChange = (e) => {
    setSelectedAmphure(e.value);
    setSelectedTambon(null);
    setNewAddress({
      ...newAddress,
      district: e.value.name_th,
      subdistrict: "",
      postalCode: "",
    });
  };

  const handleTambonChange = (e) => {
    setSelectedTambon(e.value);
    setNewAddress({
      ...newAddress,
      subdistrict: e.value.name_th,
      postalCode: String(e.value.zip_code || ""),
    });
  };

  const resetForm = () => {
    setNewAddress({
      addressLine: "",
      province: "",
      district: "",
      subdistrict: "",
      postalCode: "",
    });

    setSelectedProvince(null);
    setSelectedAmphure(null);
    setSelectedTambon(null);
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    if (!newAddress.addressLine.trim())
      newErrors.addressLine = "กรุณากรอกที่อยู่";
    if (!selectedProvince) newErrors.province = "กรุณาเลือกจังหวัด";
    if (!selectedAmphure) newErrors.district = "กรุณาเลือกเขต/อำเภอ";
    if (!selectedTambon) newErrors.subdistrict = "กรุณาเลือกตำบล";
    if (!/^\d{5}$/.test(newAddress.postalCode))
      newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์เป็นตัวเลข 5 หลัก";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    newAddress,
    setNewAddress,
    selectedProvince,
    selectedAmphure,
    selectedTambon,
    filteredAmphures,
    filteredTambons,
    handleProvinceChange,
    handleAmphureChange,
    handleTambonChange,
    fetchAddresses,
    errors,
    validateForm,
    addresses,
    provinces,
    setAddresses,
    resetForm,
  };
};

export default useAddressForm;
