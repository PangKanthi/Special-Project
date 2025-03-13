import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

function SummaryCard({ totalProductPrice, grandTotal, onConfirmOrder}) {
  const VAT_RATE = 0.07;
  const vatAmount = totalProductPrice * VAT_RATE;
  const grandtotal = totalProductPrice + vatAmount;

  
  return (
    <Card
      style={{
        width: "500px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        backgroundColor: "#f6f6f6",
        height: "350px",
      }}
    >
      <div className="flex justify-content-between text-lg">
        <p>ยอดรวมสินค้า</p>
        <p>฿{Number(totalProductPrice ?? 0).toLocaleString()}</p>
      </div>

      <div className="flex justify-content-between text-lg">
        <p>VAT (7%)</p>
        <p>฿{Number(vatAmount ?? 0).toLocaleString()}</p>
      </div>

      <div className="border-t border-gray-300 my-3"></div>

      <div
        className="flex justify-content-between mb-3 border-t border-gray-300 pt-3"
        style={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}
      >
        <strong>ยอดรวม</strong>
        <strong>฿{Number(grandTotal ?? 0).toLocaleString()}</strong>
      </div>
      <div className="pt-3 mt-8">
        <Button
          label="ยืนยันการสั่งซื้อ"
          onClick={onConfirmOrder}
          className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
        />
      </div>
    </Card>
  );
}

export default SummaryCard;
