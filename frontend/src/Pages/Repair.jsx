import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
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
  });

  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const fileUploadRef = useRef(null);

  const serviceTypes = [
    { label: "ประตูม้วน", value: "shutter" },
    { label: "อะไหล่ประตูม้วน", value: "shutter_parts" },
  ];

  const validateNotEmpty = (value) => value.trim() !== "";

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
    // เช็คว่าถูกเรียกกี่ครั้ง
    console.log("uploadHandler is called with:", event.files);
  
    setForm((prevForm) => {
      const newFiles = [];
      event.files.forEach((file) => {
        // ถ้าชื่อไฟล์ตรงกัน หรือ file.size ตรงกัน ให้ถือว่าซ้ำ
        const isDuplicate = prevForm.images.some((img) => img.file.name === file.name && img.file.size === file.size);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("problemDescription", form.problemDescription);
    formData.append("serviceType", form.serviceType);

    form.images.forEach((img) => {
      formData.append("images", img.file);
    });

    if (!form.useExistingAddress) {
      const addressData = {
        addressLine: form.addressLine.trim() || "",
        province: form.province?.name_th || "",
        district: form.district?.name_th || "",
        subdistrict: form.subdistrict || "",
        postalCode: form.postcode || "",
      };
      formData.append("address", JSON.stringify(addressData));
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
        alert("แจ้งซ่อมสำเร็จ");
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
        navigate("/profile");
      } else {
        const errorData = await response.json();
        alert(`เกิดข้อผิดพลาด: ${errorData.error}`);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "50px",
      }}
    >
      <h2
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}
      >
        แจ้งซ่อม
      </h2>
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#F5F5F5",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <RepairForm
          form={form}
          setForm={setForm} 
          handleInputChange={handleInputChange}
          serviceTypes={serviceTypes}
          errors={errors}
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
            onClick={(e) => handleSubmit(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default Repair;
