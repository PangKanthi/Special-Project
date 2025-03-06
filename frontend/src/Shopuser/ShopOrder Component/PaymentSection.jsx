import React, { useState } from "react";
import { Card } from "primereact/card";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

const PaymentSection = ({ handleImageUpload, handleRemoveImage, handleOrderConfirmation }) => {
  const [transferStatus, setTransferStatus] = useState("รอการอัปโหลดสลิป");

  return (
    <div className="w-full lg:w-auto flex justify-end pt-3">
      <Card
        style={{
          width: "500px",
          height: "500px",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#f6f6f6",
        }}
      >
        <div>
          <p>บัญชี กสิกร</p>
        </div>
        <div>
          <p>เลขบัญชี 0591344439</p>
        </div>
        <div>
          <p>ชื่อบัญชี กันต์ธี จิตรแก้ว</p>
        </div>

        {/* ✅ อัปโหลดสลิป */}
        <div className="p-field p-col-12 pt-2">
          <label>เพิ่มรูปภาพ</label>
          <div className="pt-2">
            <FileUpload
              name="images"
              mode="advanced"
              accept="image/jpeg, image/png"
              maxFileSize={1000000}
              customUpload
              uploadHandler={handleImageUpload}
              onRemove={handleRemoveImage}
              chooseLabel="เลือกไฟล์"
            />
          </div>
        </div>

        {/* ✅ แสดงสถานะของการโอนเงิน */}
        <div className="pt-3">
          <p
            style={{
              color: transferStatus.includes("❌") ? "red" : transferStatus.includes("✅") ? "green" : "black",
              fontWeight: "bold",
            }}
          >
            {transferStatus}
          </p>
        </div>

        {/* ✅ ปุ่มยืนยันการโอนเงิน */}
        <div className="pt-3">
          <Button
            label="ยืนยันการโอนเงิน"
            onClick={handleOrderConfirmation}
            className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
          />
        </div>
      </Card>
    </div>
  );
};

export default PaymentSection;
