import { useState, useEffect } from "react";
import useLocationData from "../../../Hooks/useLocationData";

const useAddressForm = () => {
    const { provinces, amphures, tambons } = useLocationData();
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedAmphure, setSelectedAmphure] = useState(null);
    const [selectedTambon, setSelectedTambon] = useState(null);
    const [errors, setErrors] = useState({});
    const [addresses, setAddresses] = useState([]);

    const [newAddress, setNewAddress] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        province: "",
        district: "",
        subDistrict: "",
        postalCode: "",
        apartment: "",
    });

    const filteredAmphures = amphures?.data?.filter(a => a.province_id === selectedProvince?.id) || [];
    const filteredTambons = tambons?.data?.filter(t => t.amphure_id === selectedAmphure?.id) || [];

    const handleProvinceChange = (e) => {
        setSelectedProvince(e.value);
        setSelectedAmphure(null);
        setSelectedTambon(null);
        setNewAddress({ ...newAddress, province: e.value.name_th, district: "", subDistrict: "", postalCode: "" });
    };

    const handleAmphureChange = (e) => {
        setSelectedAmphure(e.value);
        setSelectedTambon(null);
        setNewAddress({ ...newAddress, district: e.value.name_th, subDistrict: "", postalCode: "" });
    };

    const handleTambonChange = (e) => {
        setSelectedTambon(e.value);
        setNewAddress(prevState => ({
            ...prevState,
            subDistrict: e.value.name_th,
            postalCode: String(e.value.zip_code || "")
        }));
    };
    
    const validateForm = () => {
        let newErrors = {};
        const thaiPattern = /^[ก-๙\s]+$/;
        const numberPattern = /^[0-9]+$/;

        if (!newAddress.firstName.match(thaiPattern)) {
            newErrors.firstName = "กรุณากรอกชื่อเป็นภาษาไทย";
        }
        if (!newAddress.lastName.match(thaiPattern)) {
            newErrors.lastName = "กรุณากรอกนามสกุลเป็นภาษาไทย";
        }
        if (!newAddress.phone.match(numberPattern) || newAddress.phone.length < 9 || newAddress.phone.length > 10) {
            newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 9-10 หลัก";
        }
        if (!newAddress.address.trim()) {
            newErrors.address = "กรุณากรอกที่อยู่";
        }
        if (!selectedProvince) {
            newErrors.province = "กรุณาเลือกจังหวัด";
        }
        if (!selectedAmphure) {
            newErrors.district = "กรุณาเลือกเขต/อำเภอ";
        }
        if (!selectedTambon) {
            newErrors.subDistrict = "กรุณาเลือกตำบล";
        }

        const postalCodeStr = String(newAddress.postalCode || "");

        if (!postalCodeStr.match(numberPattern) || postalCodeStr.length !== 5) {
            newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์เป็นตัวเลข 5 หลัก";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveAddress = () => {
        if (validateForm()) {
            setAddresses([...addresses, newAddress]);
            setNewAddress({
                firstName: "",
                lastName: "",
                phone: "",
                address: "",
                province: "",
                district: "",
                subDistrict: "",
                postalCode: "",
                apartment: "",
            });
            setErrors({});
        }
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
        errors,
        validateForm,
        saveAddress, // ✅ ส่งฟังก์ชัน saveAddress ออกไป
        addresses, // ✅ ส่ง addresses ออกไปเพื่อใช้ใน AddressPage
        provinces,
        setAddresses,
    };
};

export default useAddressForm;
