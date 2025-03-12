import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";

const ProductTable = ({ products, handleEdit, handleDelete,}) => {
  console.log(products)
  return (
    <div className="shadow-md p-4 rounded-lg bg-white">
      <DataTable value={products} paginator rows={10}>
        <Column
          header="Image"
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
        <Column field="name" header="Product Name" />
        <Column
          field="category"
          header="Type"
          body={(rowData) => {
            const categoryMap = {
              // 🔹 หมวดหมู่ประตูม้วน
              "electric_shutter": "ประตูม้วนแบบไฟฟ้า",
              "chain_electric_shutter": "ประตูม้วนแบบรอกโซ่ไฟฟ้า",
              "spring_shutter": "ประตูม้วนแบบสปริง",

              // 🔹 หมวดหมู่อะไหล่ประตูม้วน
              "shutter_panel": "แผ่นประตูม้วน",
              "door_track": "รางประตู",
              "shaft": "เพลา",
              "spring": "สปริง",
              "shaft_cover": "ฝาครอบเพลา",
              "door_lock": "ตัวล็อกประตู",
              "motor": "มอเตอร์",
              "control_box": "กล่องควบคุม",
              "remote_control": "รีโมทคอนโทรล / ปุ่มควบคุม",
              "sensor_system": "ระบบเซนเซอร์",
              "backup_battery": "แบตเตอรี่สำรอง",
              "emergency_crank": "มือหมุนฉุกเฉิน"
            };

            return categoryMap[rowData.category] || "ไม่ระบุ";
          }}
        />
        <Column
          field="price"
          header="Price"
          body={(rowData) => `$${rowData.price}`}
        />
        <Column field="stock_quantity" header="Piece" />
        <Column
          header="Available Color"
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
          header="Action"
          body={(rowData) => (
            <div className="flex space-x-3">
              <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-secondary"
                onClick={() => handleEdit(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-text p-button-danger"
                onClick={() => handleDelete(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>
    </div>
  );
};

export default ProductTable;
