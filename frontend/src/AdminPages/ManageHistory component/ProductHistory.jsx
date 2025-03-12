import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import moment from "moment";

const ProductHistory = () => {
  const [productData, setProductData] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await fetch("http://localhost:1234/api/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        setProductData(data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching product data:", error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <InputText
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder="ค้นหาสินค้า"
          className="w-64 p-2 border rounded"
        />
      </div>

      <DataTable value={productData.filter(product => product.name.toLowerCase().includes(searchProduct.toLowerCase()))} paginator rows={5} responsiveLayout="scroll">
        <Column field="id" header="ID" />
        <Column field="name" header="ชื่อสินค้า" />
        <Column field="category" header="หมวดหมู่" />
        <Column field="price" header="ราคา" />
        <Column field="stock" header="จำนวนคงเหลือ" />
      </DataTable>
    </>
  );
};

export default ProductHistory;
