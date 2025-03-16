import React, { useEffect } from "react";
import AddressForm from "../User Pages/Profile component/AddressPage component/AddressForm";
import useAddressForm from "../User Pages/Profile component/AddressPage component/useAddressForm";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AddAddress = () => {
    const {
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
        provinces,
        resetForm,
    } = useAddressForm();

    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId; // 📌 รับ userId มาจากหน้า Register

    useEffect(() => {
        // ✅ ตรวจสอบว่ามี userId หรือไม่
        if (!userId) {
            console.error("❌ ไม่พบ userId! กลับไปหน้า Login");
            navigate("/login");
        }
    }, [userId, navigate]);

    const saveAddress = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Token หายไป! กรุณาเข้าสู่ระบบใหม่");
            alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
            navigate("/login");
            return;
        }

        try {
            const addressData = {
                address: {
                    userId,  // ✅ เพิ่ม userId
                    addressLine: newAddress.addressLine,
                    province: newAddress.province,
                    district: newAddress.district,
                    subdistrict: newAddress.subdistrict,
                    postalCode: parseInt(newAddress.postalCode, 10),
                },
            };

            console.log("📌 กำลังส่งข้อมูลที่อยู่:", addressData);

            await axios.post(`${process.env.react_app_api}/addresses`, addressData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ ที่อยู่ถูกบันทึกเรียบร้อยแล้ว!");
            navigate("/home");
        } catch (error) {
            console.error("❌ ไม่สามารถบันทึกที่อยู่ได้:", error.response?.data || error.message);
            alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="surface-card p-6 shadow-2 border-round-lg" style={{ width: "100%", maxWidth: "600px" }}>
                <h2 className="text-center mb-4 text-blue-600">เพิ่มที่อยู่</h2>
                <AddressForm
                    newAddress={newAddress}
                    setNewAddress={setNewAddress}
                    selectedProvince={selectedProvince}
                    selectedAmphure={selectedAmphure}
                    selectedTambon={selectedTambon}
                    filteredAmphures={filteredAmphures}
                    filteredTambons={filteredTambons}
                    handleProvinceChange={handleProvinceChange}
                    handleAmphureChange={handleAmphureChange}
                    handleTambonChange={handleTambonChange}
                    errors={errors}
                    saveAddress={saveAddress}
                    provinces={provinces}
                />
            </div>
        </div>
    );
};

export default AddAddress;
