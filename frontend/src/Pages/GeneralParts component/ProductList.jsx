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
      {products.map((product) => (
        <div key={product.id} style={{ width: "325px" }}>
          <Link to={`/productAuto/${product.id}`} style={{ textDecoration: "none" }}>
            <Card
              title={product.name}
              subTitle={product.description}
              header={
                <img
                  alt={product.name}
                  src={
                    product.images && product.images.length > 0
                      ? `http://localhost:1234${product.images[0]}`
                      : "https://via.placeholder.com/300"
                  }
                  style={{
                    width: "250px",
                    height: "250px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              }
              footer={
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {product.price
                    ? `${Number(product.price).toLocaleString()} บาท`
                    : "ไม่มีข้อมูลราคา"}
                </span>
              }
              className="m-2 p-shadow-5"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
