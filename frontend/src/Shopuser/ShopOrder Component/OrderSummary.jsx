import React from "react";
import { Card } from "primereact/card";

const OrderSummary = ({ totalProductPrice, totalInstallationFee, grandTotal }) => {
  return (
    <div className="w-full lg:w-auto justify-content-center flex">
      <Card
        style={{
          width: "500px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          backgroundColor: "#f6f6f6",
          height: "250px",
        }}
      >
        {/* ✅ แสดงยอดรวมของสินค้า */}
        <div className="flex justify-content-between text-lg">
          <p>ยอดรวม</p>
          <p>฿{totalProductPrice.toLocaleString()}</p>
        </div>

        {/* ✅ แสดงค่าธรรมเนียมการติดตั้ง */}
        <div className="flex justify-content-between mb-3">
          <p>ค่าธรรมเนียมการติดตั้ง</p>
          <p>฿{totalInstallationFee.toLocaleString()}</p>
        </div>

        {/* ✅ เส้นคั่น */}
        <div className="border-t border-gray-300 my-3"></div>

        <div
          className="flex justify-content-between mb-3 border-t border-gray-300 pt-3"
          style={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}
        >
          <strong>ยอดรวม</strong>
          <strong>฿{grandTotal.toLocaleString()}</strong>
        </div>
      </Card>
    </div>
  );
};

export default OrderSummary;
