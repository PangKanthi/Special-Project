import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { TabMenu } from "primereact/tabmenu";

const ProductTable = ({
  products,
  handleEdit,
  categoryOptions,
}) => {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const unitMap = {
    แผ่นประตูม้วน: "แผ่น",
    เสารางประตูม้วน: "เส้น",
    แกนเพลาประตูม้วน: "แท่ง",
    กล่องเก็บม้วนประตู: "กล่อง",
    ตัวล็อกประตูม้วน: "ตัว",
    กุญแจประตูม้วน: "ชุด",
    รอกโซ่ประตูม้วน: "ชุด",
    ชุดเฟืองโซ่ประตูม้วน: "ชุด",
    โซ่ประตูม้วน: "เมตร",
    ตัวล็อคโซ่สาว: "ตัว",
    ชุดมอเตอร์ประตูม้วน: "ชุด",
    สวิตช์กดควบคุม: "ชุด",
    manual_rolling_shutter: "ชุด",
    chain_electric_shutter: "ชุด",
    electric_rolling_shutter: "ชุด",
  };

  useEffect(() => {
    filterProducts(activeTab);
  }, [products, activeTab]);

  const filterProducts = (category) => {
    if (category === "ทั้งหมด") {
      setFilteredProducts(products);
    } else if (category === "shutter") {
      setFilteredProducts(
        products.filter((product) =>
          categoryOptions.shutter.some((c) => c.value === product.category)
        )
      );
    } else if (category === "shutter_parts") {
      setFilteredProducts(
        products.filter((product) =>
          categoryOptions.shutter_parts.some(
            (c) => c.value === product.category
          )
        )
      );
    }
  };

  const items = [
    { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
    { label: "ประตูม้วน", value: "shutter", icon: "pi pi-box" },
    { label: "อะไหล่ประตูม้วน", value: "shutter_parts", icon: "pi pi-cog" },
  ];

  return (
    <div className="shadow-md p-4 rounded-lg bg-white">
      <TabMenu
        model={items}
        activeIndex={activeIndex}
        onTabChange={(e) => {
          setActiveTab(e.value.value);
          setActiveIndex(items.findIndex((tab) => tab.value === e.value.value));
          filterProducts(e.value.value);
        }}
      />
      <DataTable value={filteredProducts} paginator rows={10}>
        <Column
          header="รูปภาพ"
          body={(rowData) =>
            rowData.images && rowData.images.length > 0 ? (
              <img
                src={`http://localhost:1234${rowData.images[0]}`}
                alt="Product"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            ) : (
              <Avatar shape="square" size="large" className="bg-gray-300" />
            )
          }
        />
        <Column field="name" header="ชื่อสินค้า" />
        <Column
          field="category"
          header="หมวดหมู่"
          body={(rowData) => {
            const categoryMap = {
              // 🔹 หมวดหมู่ประตูม้วน
              electric_rolling_shutter: "ประตูม้วนแบบไฟฟ้า",
              chain_electric_shutter: "ประตูม้วนแบบรอกโซ่",
              manual_rolling_shutter: "ประตูม้วนแบบมือดึง",

              // 🔹 หมวดหมู่อะไหล่ประตูม้วน
              แผ่นประตูม้วน: "แผ่นประตูม้วน",
              เสารางประตูม้วน: "เสารางประตูม้วน",
              แกนเพลาประตูม้วน: "แกนเพลาประตูม้วน",
              กล่องเก็บม้วนประตู: "กล่องเก็บม้วนประตู",
              ตัวล็อกประตูม้วน: "ตัวล็อกประตูม้วน",
              กุญแจประตูม้วน: "กุญแจประตูม้วน",
              รอกโซ่ประตูม้วน: "รอกโซ่ประตูม้วน",
              ชุดเฟืองโซ่ประตูม้วน: "ชุดเฟืองโซ่ประตูม้วน",
              โซ่ประตูม้วน: "โซ่ประตูม้วน",
              ตัวล็อคโซ่สาว: "ตัวล็อคโซ่สาว",
              ชุดมอเตอร์ประตูม้วน: "ชุดมอเตอร์ประตูม้วน",
              สวิตช์กดควบคุม: "สวิตช์กดควบคุม",
            };

            return categoryMap[rowData.category] || "ไม่ระบุ";
          }}
        />
        <Column
          field="price"
          header="ราคา"
          body={(rowData) =>
            rowData.price
              ? `${rowData.price.toLocaleString()} บาท/${
                  unitMap[rowData.category] || "ชุด"
                }`
              : "ราคาตามขนาด"
          }
        />
        <Column
          field="stock_quantity"
          header="จำนวนคงเหลือ"
          body={(rowData) =>
            rowData.stock_quantity !== undefined &&
            rowData.stock_quantity !== null
              ? `${rowData.stock_quantity.toLocaleString()} ${
                  unitMap[rowData.category] || "ชุด"
                }`
              : "ไม่จำกัดจำนวน"
          }
        />

        <Column
          header="สี"
          body={(rowData) => (
            <div className="flex space-x-2">
              {rowData.colors.map((color, i) => (
                <Tag
                  key={i}
                  style={{
                    backgroundColor: color,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                  }}
                />
              ))}
            </div>
          )}
        />
        <Column
          header="การจัดการ"
          body={(rowData) => (
            <div className="flex space-x-3">
              <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-secondary"
                onClick={() => handleEdit(rowData)}
              />
            </div>
          )}
        />
        <Column
          header="การจัดการ"
          body={(rowData) => (
            <Button
              label={rowData.status ? "ยกเลิกชั่วคราว" : "กำลังวางขาย"}
              className={
                rowData.status ? "p-button-danger" : "p-button-success"
              }
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default ProductTable;
