import React from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";

const ProductList = ({ products }) => {
  if (!products) return null;
  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", width: "100%" }}>
        <h3 style={{ color: "gray" }}>ไม่พบสินค้า</h3>
      </div>
    );
  }

  return (
    <div className="lg:flex-1 flex gap-4 justify-content-center flex-wrap lg:pt-4">
      {products.map((product) => {
        // ตรวจจับประเภทของสินค้า
        const categoryInfo = {
          manual_rolling_shutter: {
            title: "ประตูม้วนแบบมือดึง",
            details: [
              "เหมาะกับโรงงาน โกดัง และศูนย์การค้า",
              "เปิด-ปิดอัตโนมัติด้วยระบบไฟฟ้า",
              "รองรับการควบคุมผ่านรีโมท",
            ],
          },
          chain_electric_shutter: {
            title: "ประตูม้วนแบบรอกโซ่",
            details: [
              "เหมาะกับโรงงานขนาดกลาง-ใหญ่",
              "ใช้งานด้วยมือ หมดปัญหาไฟดับ",
              "มีระบบล็อกเสริมความปลอดภัย",
            ],
          },
          electric_rolling_shutter: {
            title: "ประตูม้วนแบบไฟฟ้า",
            details: [
              "เหมาะสำหรับร้านค้าและอาคารพาณิชย์",
              "ใช้งานง่าย ดึงขึ้น-ลงได้สะดวก",
              "ไม่ต้องใช้พลังงานไฟฟ้า",
            ],
          },
        };

        const info = categoryInfo[product.category];

        return (
          <div key={product.id} style={{ width: "325px" }}>
            <Link
              to={`/productAuto/${product.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                header={
                  <div className="pt-3">
                    <img
                      alt={product.name}
                      src={
                        product.images && product.images.length > 0
                          ? `${process.env.REACT_APP_API}${product.images[0]}`
                          : "https://via.placeholder.com/300"
                      }
                      style={{
                        width: "270px",
                        height: "250px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                }
                title={product.name}
                footer={
                  <div>
                    {info && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "12px",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        <h4
                          style={{
                            color: "#0056b3",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                          }}
                        >
                          {info.title}
                        </h4>
                        <ul style={{ paddingLeft: "20px", fontSize: "1rem" }}>
                          {info.details.map((detail, index) => (
                            <li key={index} style={{ marginBottom: "6px" }}>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="pt-2">
                      <span
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        {product.price
                          ? `${Number(product.price).toLocaleString()} บาท`
                          : "ราคาขึ้นอยู่กับขนาด"}
                      </span>
                    </div>
                  </div>
                }
                className="m-2 p-shadow-5"
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
