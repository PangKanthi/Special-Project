import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";

function ShopOrderInformation() {
  const navigate = useNavigate();
  return (
    <div
      className="flex justify-content-center align-items-center"
      style={{ minHeight: "50vh", padding: "1rem" }}
    >
      <div
        className="surface-card p-6 shadow-2 border-round-lg text-center"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <i className="pi pi-check-circle text-7xl text-green-500 mb-4"></i>
        <h1 className="text-blue-600">การสั่งซื้อสำเร็จ</h1>
        <p className="text-gray-600">
        ได้รับข้อมูลการสั่งซื้อเรียบร้อยแล้ว เราจะเร่งดำเนินการติดต่อกลับโดยเร็ว
        </p>
        <Button
          label="กลับไปหน้าหลัก"
          className="p-button-primary w-full mt-3"
          onClick={() => navigate("/home")}
        />
      </div>
    </div>
  );
}

export default ShopOrderInformation;