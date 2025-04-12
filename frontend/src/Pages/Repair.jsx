import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import RepairForm from "./Repair component/RepairForm";
import { useNavigate } from "react-router-dom";
import "primeflex/primeflex.css";

const Repair = () => {
  const [form, setForm] = useState({
    province: "",
    district: "",
    postcode: "",
    addressLine: "",
    problemDescription: "",
    serviceType: "",
    images: [],
    product_name: "",        // ชื่อสินค้า
    product_image: [],       // รูปภาพสินค้า
    color: "",               // สี
    width: "",               // ความกว้าง
    length: "",              // ความยาว
    thickness: "",           // ความหนา
    installOption: "",       // ตัวเลือกติดตั้ง
    quantity: "",            // จำนวน
    price: "",               // ราคาต่อชิ้น
  });

  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ เก็บรายการที่อยู่ทั้งหมดใน state
  const [addresses, setAddresses] = useState([]);

  // ✅ เก็บที่อยู่ที่เลือกจาก Dropdown
  const [selectedAddress, setSelectedAddress] = useState(null);

  // ✅ เก็บข้อมูล user (ชื่อ, นามสกุล, เบอร์) เพื่อแสดงในหน้า
  const [user, setUser] = useState(null);

  const [completedProducts, setCompletedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const fileUploadRef = useRef(null);
  const toast = useRef(null);

  // ✅ ดึง Token เพื่อเช็คว่า login อยู่หรือไม่
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // 📌 ฟังก์ชันดึงข้อมูลที่อยู่
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAddresses(data.data || []);
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงที่อยู่:", err);
      }
    };
    // 📌 ฟังก์ชันดึงข้อมูลผู้ใช้
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };

    if (token) {
      fetchAddresses();
      fetchUser();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCompletedProducts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/repair-requests/completed-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setCompletedProducts(data.data);
      } catch (err) {
        console.error("ไม่สามารถดึงสินค้าที่เคยสั่งซื้อได้:", err);
      }
    };

    if (token) fetchCompletedProducts();
  }, []);

  // ✅ ฟังก์ชัน handleAddressSelection สำหรับเลือกที่อยู่จาก Dropdown
  const handleAddressSelection = (selected) => {
    if (selected) {
      setSelectedAddress(selected);
      setForm((prevForm) => ({
        ...prevForm,
        addressLine: selected.addressLine,
        province: selected.province,
        district: selected.district,
        subdistrict: selected.subdistrict,
        postcode: selected.postalCode,
      }));
    } else {
      // ถ้า user กลับมาเลือกเป็น "null" (ไม่มีที่อยู่)
      setSelectedAddress(null);
      setForm((prevForm) => ({
        ...prevForm,
        addressLine: "",
        province: "",
        district: "",
        subdistrict: "",
        postcode: "",
      }));
    }
  };

  // ✅ ประเภทการซ่อม
  const serviceTypes = [
    { label: "ประตูม้วน", value: "shutter" },
    { label: "อะไหล่ประตูม้วน", value: "shutter_parts" },
  ];

  // ✅ ฟังก์ชัน validate ฟิลด์ว่าง
  const validateNotEmpty = (value) => value.trim() !== "";

  // ✅ ฟังก์ชัน handleInputChange
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateRepairField(field, value),
    }));
  };

  // ✅ ฟังก์ชัน validate ฟิลด์ซ่อม
  const validateRepairField = (field, value) => {
    switch (field) {
      case "addressLine":
        return validateNotEmpty(value) ? "" : "กรุณากรอกที่อยู่";
      case "serviceType":
        return validateNotEmpty(value) ? "" : "กรุณาเลือกประเภทการซ่อม";
      default:
        return "";
    }
  };

  // ✅ ฟังก์ชันเพิ่มไฟล์ลง state
  const handleImageUpload = (event) => {
    setForm((prevForm) => {
      const newFiles = [];
      event.files.forEach((file) => {
        const isDuplicate = prevForm.images.some(
          (img) => img.file.name === file.name && img.file.size === file.size
        );
        if (!isDuplicate) {
          newFiles.push({ file, previewUrl: URL.createObjectURL(file) });
        }
      });
      return {
        ...prevForm,
        images: [...prevForm.images, ...newFiles],
      };
    });
  };

  // ✅ ฟังก์ชันลบรูปภาพออกจาก state
  const handleRemoveImage = (event) => {
    setForm((prevForm) => {
      const updatedImages = prevForm.images.filter(
        (image) => image.file.name !== event.file.name
      );
      return { ...prevForm, images: updatedImages };
    });
  };

  // ✅ ฟังก์ชัน handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("problemDescription", form.problemDescription);
    formData.append("serviceType", form.serviceType);
    formData.append("firstname", user?.firstname || "");
    formData.append("lastname", user?.lastname || "");
    formData.append("product_name", form.product_name);
    formData.append("color", form.color);
    formData.append("width", form.width);
    formData.append("length", form.length);
    formData.append("thickness", form.thickness);
    formData.append("installOption", form.installOption);
    formData.append("quantity", form.quantity);
    formData.append("price", form.price);

    form.product_image.forEach((img) => {
      formData.append("product_image", img);
    });
    

    form.images.forEach((img) => {
      formData.append("images", img.file);
    });

    if (selectedAddress) {
      formData.append("addressId", parseInt(selectedAddress.id, 10));
      formData.append(
        "address",
        JSON.stringify({
          addressLine: selectedAddress.addressLine,
          province: selectedAddress.province,
          district: selectedAddress.district,
          subdistrict: selectedAddress.subdistrict,
          postalCode: selectedAddress.postalCode,
        })
      );
    } else {
      // ถ้า user ไม่ได้เลือก -> ใช้ค่าที่กรอกเอง
      formData.append(
        "address",
        JSON.stringify({
          addressLine: form.addressLine.trim() || "",
          province: form.province?.name_th || "",
          district: form.district?.name_th || "",
          subdistrict: form.subdistrict || "",
          postalCode: form.postcode || "",
        })
      );
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/repair-requests/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast.current.show({
          severity: "success",
          summary: "สำเร็จ",
          detail: "แจ้งซ่อมสำเร็จ",
          life: 3000, // แสดงผล 3 วินาที
        });
        // ✅ รอ 1.5 วินาทีก่อนเปลี่ยนหน้า
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
        setForm({
          province: "",
          district: "",
          postcode: "",
          addressLine: "",
          problemDescription: "",
          serviceType: "",
          images: [],
        });
        fileUploadRef.current.clear();
      } else {
        const errorData = await response.json();
        toast.current.show({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: errorData.error || "กรุณาลองอีกครั้ง",
          life: 3000,
        });
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "เชื่อมต่อเซิร์ฟเวอร์ผิดพลาด",
        detail: "กรุณาลองใหม่ภายหลัง",
        life: 3000,
      });
    }
  };

  // ✅ เช็ค token อีกครั้งเผื่อ user logout ไป
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      // ✅ ตั้งค่าที่อยู่ตาม order เดิม
      if (selectedProduct.address) {
        setSelectedAddress(selectedProduct.address);
        setForm(prevForm => ({
          ...prevForm,
          addressLine: selectedProduct.address.addressLine,
          province: selectedProduct.address.province,
          district: selectedProduct.address.district,
          subdistrict: selectedProduct.address.subdistrict,
          postcode: selectedProduct.address.postalCode
        }));
      }

      // ✅ ตั้งค่า product snapshot + serviceType
      setForm(prev => ({
        ...prev,
        serviceType: selectedProduct.service_type ?? '',

        // 🔁 กรอกข้อมูลสินค้าที่เลือก
        product_name: selectedProduct.name ?? '',
        product_image: selectedProduct.product_image || [],
        color: selectedProduct.color ?? '',
        width: selectedProduct.width ?? '',
        length: selectedProduct.length ?? '',
        thickness: selectedProduct.thickness ?? '',
        installOption: selectedProduct.installOption ?? '',
        quantity: selectedProduct.quantity ?? '',
        price: selectedProduct.price ?? ''
      }));
    }
  }, [selectedProduct]);


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
        backgroundSize: "cover",
        paddingBottom: "50px",
      }}
    >
      <Toast ref={toast} />
      <h2
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}
      >
        แจ้งซ่อม
      </h2>
      <Card
        className="p-shadow-6"
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#ffffffcc", // โปร่งแสงนิดหน่อย
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // ✅ เงาหนาและดูพรีเมียม
          backdropFilter: "blur(8px)",
        }}
      >
        <RepairForm
          form={form}
          setForm={setForm}
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          handleAddressSelection={handleAddressSelection}
          handleInputChange={handleInputChange}
          serviceTypes={serviceTypes}
          user={user}
          errors={errors}
          completedProducts={completedProducts}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />

        {/* ✅ ส่วนอัปโหลดรูปภาพ */}
        <div className="p-field p-col-12 pt-2">
          <label>เพิ่มรูปภาพ</label>
          <div className="pt-2">
            <FileUpload
              ref={fileUploadRef}
              name="images"
              mode="advanced"
              accept="image/*"
              maxFileSize={1000000}
              multiple
              customUpload
              uploadHandler={handleImageUpload}
              onRemove={handleRemoveImage}
              chooseLabel="เลือกไฟล์"
              auto={true}
            />
          </div>
        </div>

        <div className="flex justify-content-center mt-4">
          <Button
            label={isLoggedIn ? "บันทึก" : "เข้าสู่ระบบเพื่อแจ้งซ่อม"}
            className="p-button-primary p-button-block"
            onClick={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
};

export default Repair;
