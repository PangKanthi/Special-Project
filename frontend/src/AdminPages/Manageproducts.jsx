import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";

const colorOptions = [
  { label: "ดำ (Black)", value: "black" },
  { label: "เทา (Gray)", value: "gray" },
  { label: "ชมพู (Pink)", value: "pink" },
  { label: "น้ำเงิน (Blue)", value: "blue" },
  { label: "เขียว (Green)", value: "green" },
  { label: "แดง (Red)", value: "red" },
  { label: "ขาว (White)", value: "white" }
];

const products = Array(9).fill({
  image: "",
  name: "xxxxxxxxxxxxx",
  category: "xxxxxxxxxxxxx",
  price: 9999.0,
  piece: Math.floor(Math.random() * 700),
  colors: ["black", "gray", "pink"],
});

const categoryOptions = [
  { label: "ประตูม้วน", value: "shutter" },
  { label: "อะไหล่ประตูม้วน", value: "shutter_parts" }
];

const ManageProducts = () => {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const fileUploadRef = useRef(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    type: "",
    price: "",
    piece: "",
    colors: [],
    details: "",
    warranty: "",
    image: [],
  });

  useEffect(() => {
    if (!visible) {
      setNewProduct({
        name: "",
        category: "",
        type: "",
        price: "",
        piece: "",
        colors: "",
        details: "",
        warranty: "",
        image: "",
      });
    }
  }, [visible]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const onImageUpload = (event) => {
    const files = event.files; // รับหลายไฟล์
    const newImages = [];

    for (let file of files) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        alert("Only PNG and JPG files are allowed!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
        if (newImages.length === files.length) {
          setNewProduct((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault(); // ป้องกันการโหลดหน้าใหม่

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("is_part", newProduct.type);
    formData.append("price", newProduct.price);
    formData.append("stock_quantity", newProduct.piece);
    formData.append("colors", JSON.stringify(newProduct.colors));
    formData.append("description", newProduct.details);
    formData.append("warranty", newProduct.warranty);

    // // ถ้ามีภาพ ให้แปลง Base64 เป็นไฟล์แล้วส่งไป
    // if (newProduct.image) {
    //   const response = await fetch(newProduct.image);
    //   const blob = await response.blob();
    //   formData.append("image", blob, "product_image.png");
    // }

    try {
      const response = await axios.post("http://localhost:1234/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("✅ Success:", result);
      setVisible(false);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-4 items-center ml-auto">
          <div className="ml-auto w-72 pt-3">
            <span className="p-input-icon-left w-full flex items-center pr-3">
              <i className="pi pi-search pl-3 text-gray-500" />
              <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Order" className="w-full pl-8" />
            </span>
          </div>
          <div className="ml-auto w-72 pt-3">
            <Button
              label="Add New Product"
              icon="pi pi-plus"
              className="p-button-primary"
              onClick={() => {
                setNewProduct({
                  name: "",
                  type: "",
                  price: "",
                  piece: "",
                  colors: "",
                  details: "",
                  warranty: "",
                  image: "",
                });
                setVisible(true);
              }}
            />
          </div>
        </div>
      </div>

      <div className="shadow-md p-4 rounded-lg bg-white">
        <DataTable value={products} paginator rows={10}>
          <Column
            header="Image"
            body={() => <Avatar shape="square" size="large" className="bg-gray-300" />}
          />
          <Column field="name" header="Product Name" />
          <Column field="category" header="Type" />
          <Column field="price" header="Price" body={(rowData) => `$${rowData.price.toFixed(2)}`} />
          <Column field="piece" header="Piece" />
          <Column
            header="Available Color"
            body={(rowData) => (
              <div className="flex space-x-2">
                {rowData.colors.map((color, i) => (
                  <Tag key={i} style={{ backgroundColor: color, width: 20, height: 20, borderRadius: "50%" }} />
                ))}
              </div>
            )}
          />
          <Column
            header="Action"
            body={() => (
              <div className="flex space-x-3">
                <Button icon="pi pi-pencil" className="p-button-text p-button-secondary" />
                <Button icon="pi pi-trash" className="p-button-text p-button-danger" />
              </div>
            )}
          />
        </DataTable>
      </div>

      <Dialog header="Add New Product" visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="p-4 grid grid-cols-2 gap-6 justify-content-center">
            <div className="flex-col items-center">
              <div
                style={{ width: "400px", height: "400px" }}
                className="border justify-content-center border-gray-300 rounded-lg flex items-center mb-4 relative overflow-hidden"
              >
                {newProduct.image ? (
                  <>
                    <img
                      src={newProduct.image}
                      alt="Product"
                      className="w-full h-full"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Button
                      icon="pi pi-times"
                      className="p-button-rounded p-button-danger absolute top-0 right-0"
                      onClick={() => removeImage()}
                    />
                  </>
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="w-full text-center mt-3">
                <FileUpload
                  ref={fileUploadRef}
                  mode="basic"
                  accept="image/png, image/jpeg"
                  maxFileSize={1000000}
                  multiple={true}
                  auto
                  customUpload
                  uploadHandler={onImageUpload}
                  chooseLabel="Upload Images"
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <label className="block">Product Name</label>
                <div className="pt-2">
                  <InputText name="name" value={newProduct.name} onChange={handleInputChange} className="w-full" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Product Type</label>
                <div className="pt-2">
                  <Dropdown
                    name="type"
                    value={newProduct.type}
                    options={[
                      { label: "ประตูม้วน", value: "ประตูม้วน" },
                      { label: "อะไหล่ประตูม้วน", value: "อะไหล่ประตูม้วน" }
                    ]}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Select Product Type"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Category Type</label>
                <div className="pt-2">
                  <Dropdown
                    name="category"
                    value={newProduct.category}
                    options={categoryOptions}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.value })}
                    className="w-full"
                    placeholder="Select Category Type"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Price</label>
                <div className="pt-2">
                  <InputText name="price" value={newProduct.price} onChange={handleInputChange} className="w-full" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Piece</label>
                <div className="pt-2">
                  <InputText name="piece" value={newProduct.piece} onChange={handleInputChange} className="w-full" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Available Colors</label>
                <div className="pt-2">
                  <MultiSelect
                    name="colors"
                    value={newProduct.colors}
                    options={colorOptions}
                    onChange={(e) => setNewProduct({ ...newProduct, colors: e.value })}
                    optionLabel="label"
                    className="w-full"
                    placeholder="Select Colors"
                    display="chip"
                    maxSelectedLabels={2}
                    style={{
                      maxWidth: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap"
                    }}
                    panelHeaderTemplate={
                      <div className="p-2 border-b flex items-center bg-white" style={{ fontSize: "14px", padding: "10px" }}>
                        <div className="flex items-center w-full p-2 hover:bg-gray-200 rounded cursor-pointer"
                          style={{ fontSize: "14px", borderRadius: "6px", padding: "8px" }}>
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProduct({ ...newProduct, colors: colorOptions.map(c => c.value) });
                              } else {
                                setNewProduct({ ...newProduct, colors: [] });
                              }
                            }}
                            checked={newProduct.colors.length === colorOptions.length}
                            className="mr-2 cursor-pointer"
                            style={{ width: "18px", height: "18px" }}
                          />
                          <span className="text-sm font-medium">เลือกทั้งหมด</span>
                        </div>
                        <Button
                          icon="pi pi-times"
                          className="p-button-text p-button-sm"
                          style={{ fontSize: "14px", marginLeft: "8px", borderRadius: "6px", padding: "5px 8px" }}
                          onClick={() => setNewProduct({ ...newProduct, colors: [] })}
                        />

                      </div>
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block">Detail</label>
                <div className="pt-2">
                  <InputText name="details" value={newProduct.details} onChange={handleInputChange} className="w-full" />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Warranty</label>
                <div className="pt-2">
                  <InputText name="warranty" value={newProduct.warranty} onChange={handleInputChange} className="w-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-content-center mt-4">
            <div className="mr-3">
              <Button label="Cancel" className="p-button-danger" onClick={() => setVisible(false)} type="button" />
            </div>
            <Button label="Add Now" className="p-button-primary" type="submit" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ManageProducts;
