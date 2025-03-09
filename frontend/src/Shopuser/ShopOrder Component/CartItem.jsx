import React from "react";
import { Carousel } from "primereact/carousel";

function CartItem({ item }) {
  // ✅ ฟังก์ชันสร้างรูปภาพสำหรับ Carousel
  const imageTemplate = (imageUrl, index) => {
    return (
      <img
        key={index}
        src={imageUrl}
        alt="Product"
        style={{
          width: "100%",
          maxWidth: "300px",
          height: "auto",
          maxHeight: "300px",
          objectFit: "contain",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      />
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-start border-b border-gray-300 pb-4 mb-4">
      {/* 🔹 ส่วนแสดงรูปสินค้า */}
      <div className="w-[200px] lg:w-[300px] lg:mr-6">
        {Array.isArray(item.product.images) && item.product.images.length > 0 ? (
          <Carousel
            value={item.product.images.map((img) => `http://localhost:1234${img}`)}
            numVisible={1}
            numScroll={1}
            itemTemplate={imageTemplate}
            style={{ maxWidth: "300px", width: "100%" }}
          />
        ) : (
          <img
            src="https://via.placeholder.com/300"
            alt="ไม่มีรูปภาพ"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}
      </div>

      {/* 🔹 ส่วนแสดงรายละเอียดสินค้า */}
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        
        {/* 🔸 แสดงตัวเลือกติดตั้งและสี เฉพาะสินค้าที่ไม่ใช่อะไหล่ */}
        {!item.product.is_part && (
          <>
            <p className="text-sm text-gray-700">
              <strong>ตัวเลือกติดตั้ง:</strong> {item.installOption || "ไม่ระบุ"}
            </p>
            <p className="text-sm text-gray-700 flex items-center">
              <strong>สีที่เลือก:</strong>
              <span
                style={{
                  backgroundColor: item.color || "transparent",
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  marginLeft: "10px",
                }}
              ></span>
            </p>
          </>
        )}

        {/* 🔹 แสดงขนาดสินค้า (ถ้าไม่ใช่อะไหล่) */}
        {!item.product.is_part && (
          <p className="text-sm text-gray-700">
            <strong>ขนาด:</strong> กว้าง {item.width || "-"} ตร.ม. | ยาว {item.length || "-"} ตร.ม. | หนา {item.thickness || "-"} มม.
          </p>
        )}

        {/* 🔹 แสดงราคาสินค้า */}
        <p className="text-sm text-gray-700">
          <strong>ราคาต่อชิ้น:</strong> ฿{item.product.price.toLocaleString()}
        </p>
        <p className="text-lg font-bold text-red-500">
          <strong>ราคารวม:</strong> ฿{(item.product.price * item.quantity).toLocaleString()}
        </p>

        {/* 🔹 แสดงจำนวนสินค้า */}
        <p className="text-sm text-gray-700">
          <strong>จำนวน:</strong> {item.quantity} ชิ้น
        </p>
      </div>
    </div>
  );
}

export default CartItem;
