import React from "react";
import { Carousel } from "primereact/carousel";

function CartItem({ item }) {
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
    <div className="lg:flex">
      <div className="w-[200px] lg:pt-6">
        {Array.isArray(item.product.images) && item.product.images.length > 0 ? (
          <Carousel
            value={item.product.images}
            numVisible={1}
            numScroll={1}
            itemTemplate={imageTemplate}
            style={{ maxWidth: "400px", width: "100%" }}
          />
        ) : (
          <img
            src="https://via.placeholder.com/300"
            alt="สินค้าตัวนี้"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <div className="lg:pt-4">
        <div className="flex-1 text-left">
          <h3 className="text-sm lg:text-xl">{item.product.name}</h3>
          <p className="text-xs lg:text-base">{item.installation}</p>
          <p className="text-xs lg:text-base flex items-center">
            สีที่เลือก:
            <span
              style={{
                backgroundColor: item.selectedColor || "transparent",
                borderRadius: "50%",
                border: "1px solid #ccc",
                display: "inline-block",
                width: "20px",
                height: "20px",
                marginLeft: "10px",
              }}
            ></span>
          </p>
          <p className="text-xs lg:text-base sm:text-sm">
            กว้าง {item.dimensions?.width || "-"} ตร.ม. | ยาว{" "}
            {item.dimensions?.height || "-"} ตร.ม. | หนา{" "}
            {item.dimensions?.thickness || "-"} มม.
          </p>
          <p className="text-sm lg:text-lg">
            ฿{item.product.price.toLocaleString()}
          </p>
        </div>
        <p className="text-xs lg:text-base">จำนวน: {item.quantity}</p>
      </div>
    </div>
  );
}

export default CartItem;
