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

const categoryOptions = [
  { label: "ประตูม้วน", value: "shutter" },
  { label: "อะไหล่ประตูม้วน", value: "shutter_parts" }
];

const ManageProducts = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);

  const fileUploadRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    colors: [],
    description: "",
    warranty: "",
    images: []
  });

  useEffect(() => {
    if (!visible) {
      setNewProduct({
        name: "",
        category: "",
        price: "",
        stock_quantity: "",
        colors: [],
        description: "",
        warranty: "",
        images: [],
      });
    }
  }, [visible]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  console.log("JWT Token:", localStorage.getItem("token"));

  const onImageUpload = (event) => {
    const uploadedFiles = event.files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewProduct((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ...uploadedFiles],
    }));
  };

  const handleRemoveImage = (event) => {
    setNewProduct((prev) => {
      const updatedImages = prev.images.filter(
        (image) => image.file.name !== event.file.name
      );

      return { ...prev, images: updatedImages };
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock_quantity) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนทำการเพิ่มสินค้า");
      console.log(newProduct);
      return;
    }

    const productData = {
      name: newProduct.name,
      description: newProduct.description || "",
      price: newProduct.price ? parseFloat(newProduct.price) : 0,
      is_part: newProduct.type === "อะไหล่ประตูม้วน",  // ✅ Boolean
      category: newProduct.category,
      warranty: newProduct.warranty || "",
      stock_quantity: newProduct.stock_quantity ? Number(newProduct.stock_quantity) : 0,
      colors: Array.isArray(newProduct.colors) ? newProduct.colors : [],
      images: newProduct.images.map(img => img.previewUrl) // ✅ ส่ง URL หรือ Base64
    };

    console.log("📦 JSON Data Before Sending:", productData);

    try {
      const response = await axios.post("http://localhost:1234/api/products", productData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      console.log("✅ Success:", response.data);
      setVisible(false);
      setTimeout(fetchProducts, 500);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };



  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:1234/api/products");
      if (response.data) {
        setProducts(response.data);
      } else {
        console.warn("⚠️ No products found in the database.");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      alert("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบการเชื่อมต่อ");
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
          <Column field="price" header="Price" body={(rowData) => `$${rowData.price}`} />
          <Column field="stock_quantity" header="Piece" />
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
              <div className="border border-gray-300 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden"
                style={{ width: "400px", height: "400px" }}>
                {(newProduct.images ?? []).length > 0 ? (
                  <>
                    <img src={newProduct.images[0].previewUrl} alt="Product Preview" className="w-full h-full object-cover" />
                  </>
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>
              <div className="w-full text-center mt-3">
                <FileUpload
                  ref={fileUploadRef}
                  accept="image/png, image/jpeg"
                  maxFileSize={1000000}
                  multiple={true}
                  auto
                  customUpload
                  uploadHandler={onImageUpload}
                  chooseLabel="Upload Images"
                  onRemove={handleRemoveImage}
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
                    name="is_part"
                    value={newProduct.is_part}
                    options={[
                      { label: "ประตูม้วน", value: false },
                      { label: "อะไหล่ประตูม้วน", value: true }
                    ]}
                    onChange={(e) => setNewProduct({ ...newProduct, is_part: e.value })}
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
                <label className="block">Stock Quantity</label>
                <div className="pt-2">
                  <InputText name="stock_quantity" value={newProduct.stock_quantity} onChange={handleInputChange} className="w-full" required />
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
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block">Description</label>
                <div className="pt-2">
                  <InputText name="description" value={newProduct.description} onChange={handleInputChange} className="w-full" />
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
