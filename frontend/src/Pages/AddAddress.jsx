import React, { useEffect, useRef } from "react";
import AddressForm from "../User Pages/Profile component/AddressPage component/AddressForm";
import useAddressForm from "../User Pages/Profile component/AddressPage component/useAddressForm";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
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
    const toastRef = useRef(null); // ✅ สร้าง toastRef

    useEffect(() => {
        if (!userId) {
            toastRef.current?.show({
                severity: "error",
                summary: "ไม่พบผู้ใช้",
                detail: "กรุณาเข้าสู่ระบบอีกครั้ง",
                life: 3000,
            });
            navigate("/login");
        }
    }, [userId, navigate]);


    const saveAddress = async () => {
        if (!validateForm()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toastRef.current?.show({
                severity: "warn",
                summary: "หมดเวลาใช้งาน",
                detail: "กรุณาเข้าสู่ระบบใหม่",
                life: 3000,
            });
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

            await axios.post(`${process.env.REACT_APP_API}/api/addresses`, addressData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toastRef.current?.show({
                severity: "success",
                summary: "บันทึกสำเร็จ",
                detail: "ที่อยู่ถูกบันทึกเรียบร้อยแล้ว",
                life: 3000,
            });

            setTimeout(() => {
                navigate("/home");
            }, 1000); // รอแป๊บนึงให้ toast แสดงก่อนเปลี่ยนหน้า

        } catch (error) {
            console.error("❌ ไม่สามารถบันทึกที่อยู่ได้:", error.response?.data || error.message);
            toastRef.current?.show({
                severity: "error",
                summary: "เกิดข้อผิดพลาด",
                detail: "กรุณาลองใหม่อีกครั้ง",
                life: 3000,
            });
        }
    };

    return (
        <div className="flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Toast ref={toastRef} /> {/* ✅ Toast Component */}
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
