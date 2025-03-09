import React from "react";
import { Card } from "primereact/card";

function SummaryCard({
  totalProductPrice,
  totalInstallationFee,
  grandTotal,
}) {
  return (
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
      <div className="flex justify-content-between text-lg">
        <p>ยอดรวม</p>
        <p>฿{totalProductPrice.toLocaleString()}</p>
      </div>

      <div className="flex justify-content-between mb-3">
        <p>ค่าธรรมเนียมการติดตั้ง</p>
        <p>฿{totalInstallationFee.toLocaleString()}</p>
      </div>

      <div className="border-t border-gray-300 my-3"></div>

      <div
        className="flex justify-content-between mb-3 border-t border-gray-300 pt-3"
        style={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}
      >
        <strong>ยอดรวม</strong>
        <strong>฿{grandTotal.toLocaleString()}</strong>
      </div>
    </Card>
  );
}

export default SummaryCard;
