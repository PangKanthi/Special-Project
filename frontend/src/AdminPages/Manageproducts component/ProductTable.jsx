import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { TabMenu } from "primereact/tabmenu";

const ProductTable = ({ products, handleEdit, handleDelete, categoryOptions }) => {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);

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
          categoryOptions.shutter_parts.some((c) => c.value === product.category)
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
          setActiveIndex(items.findIndex(tab => tab.value === e.value.value));
          filterProducts(e.value.value);
        }}
      />
      <DataTable value={filteredProducts} paginator rows={10}>
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
        <Column field="category" header="Type" />
        <Column field="price" header="Price" body={(rowData) => `$${rowData.price}`} />
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
