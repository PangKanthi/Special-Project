import React, { useState } from "react";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

function SlipPayment({ grandTotal, handleOrderConfirmation }) {
  const [loading, setLoading] = useState(false);
  const [slipAmount, setSlipAmount] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const checkSlip = async () => {
    if (!selectedFile) {
      alert("กรุณาอัปโหลดสลิปก่อนตรวจสอบ");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("slip", selectedFile);

      const response = await fetch(`${process.env.REACT_APP_API}/api/check-slip`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ❌ ห้ามใส่ "Content-Type"
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "เกิดข้อผิดพลาดในการตรวจสอบสลิป");

      const slipAmount = parseFloat(data.apiResponse.data.amount);
      setSlipAmount(slipAmount);

      if (slipAmount !== grandTotal) {
        setError(
          `จำนวนเงินในสลิป (${slipAmount} บาท) ไม่ตรงกับยอดรวม (${grandTotal} บาท)`
        );
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const validateAndConfirm = () => {
    if (!selectedFile) {
      alert("กรุณาอัปโหลดสลิปก่อน");
      return;
    }

    if (slipAmount !== grandTotal) {
      alert(
        `จำนวนเงินที่โอน (${slipAmount} บาท) ไม่ตรงกับยอดรวมที่ต้องจ่าย (${grandTotal} บาท)`
      );
      return;
    }

    handleOrderConfirmation();
  };

  return (
    <div>
      <Card>
        <div>
          <label>เพิ่มรูปภาพสลิปโอนเงิน</label>
          <FileUpload
            name="file"
            mode="advanced"
            accept="image/*"
            maxFileSize={5000000}
            customUpload
            uploadHandler={handleImageUpload}
            chooseLabel="เลือกไฟล์"
            auto
          />
        </div>

        <div className="mt-4">
          <Button
            label="ตรวจสอบสลิป"
            onClick={checkSlip}
            className="w-full bg-yellow-500 text-white py-2 text-lg font-bold rounded"
            disabled={loading}
          />
        </div>

        {loading && <p>กำลังตรวจสอบสลิป...</p>}
        {slipAmount !== null && (
          <p className="mt-2 text-green-600">
            ยอดเงิน: {slipAmount} บาท
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        <div className="pt-3">
          <Button
            label="ยืนยันการสั่งซื้อ"
            onClick={validateAndConfirm}
            className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
            disabled={slipAmount === null || slipAmount !== grandTotal}
          />
        </div>
      </Card>
    </div>
  );
}

export default SlipPayment;
