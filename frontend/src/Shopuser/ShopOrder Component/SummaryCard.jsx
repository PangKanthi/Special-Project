import React from "react";
import { Card } from "primereact/card";

function SummaryCard({ totalProductPrice, totalInstallationFee, grandTotal }) {
  const VAT_RATE = 0.07;
  const SHIPPING_COST = totalProductPrice > 1000 ? 0 : 50;
  const DISCOUNT = totalProductPrice > 2000 ? 200 : 0;
  const vatAmount = totalProductPrice * VAT_RATE;
  const grandtotal =
    totalProductPrice +
    totalInstallationFee +
    vatAmount +
    SHIPPING_COST -
    DISCOUNT;

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
      <div className="flex justify-content-between text-lg">
        <p>VAT (7%)</p>
        <p>฿{vatAmount.toLocaleString()}</p>
      </div>

      <div className="flex justify-content-between text-lg">
        <p>ค่าจัดส่ง</p>
        <p>
          {SHIPPING_COST === 0 ? "ฟรี" : `฿${SHIPPING_COST.toLocaleString()}`}
        </p>
      </div>

      {DISCOUNT > 0 && (
        <div className="flex justify-content-between text-lg text-red-500 font-bold">
          <p>ส่วนลด</p>
          <p>-฿{DISCOUNT.toLocaleString()}</p>
        </div>
      )}

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
