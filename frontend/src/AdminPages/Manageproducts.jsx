import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ProductService from "./Manageproducts component/ProductService";
import ProductTable from "./Manageproducts component/ProductTable";
import ProductForm from "./Manageproducts component/ProductForm";

const ManageProducts = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    colors: [],
    description: "",
    warranty: "",
    images: [],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await ProductService.fetchProducts();
      setProducts(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const onImageUpload = (event) => {
    const uploadedFiles = event.files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewProduct((prev) => {
      // ใช้ Set เพื่อเช็คว่าชื่อไฟล์ซ้ำหรือไม่
      const existingFileNames = new Set(prev.images.map(img => img.file?.name));
      const uniqueFiles = uploadedFiles.filter(img => !existingFileNames.has(img.file.name));

      return {
        ...prev,
        images: [...prev.images, ...uniqueFiles],
      };
    });
  };

  // ✅ ลบรูปภาพทั้งจาก UI และ FileUpload
  const handleRemoveImage = (imageToRemove, event) => {
    event.stopPropagation(); // ✅ ป้องกันการ trigger event ที่อาจทำให้ Dialog ปิด

    setNewProduct((prev) => {
      const updatedImages = prev.images.filter((image) => {
        if (!image.file) {
          return image.previewUrl !== imageToRemove.previewUrl;
        }
        return image.file.name !== imageToRemove.file.name;
      });

      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock_quantity) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนทำการเพิ่มสินค้า");
      return;
    }

    try {
      await ProductService.addProduct(newProduct);
      setVisible(false);
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock_quantity: product.stock_quantity,
      colors: Array.isArray(product.colors) ? product.colors : [],
      description: product.description || "",
      warranty: product.warranty || "",
      images: product.images
        ? product.images.map((img) => ({ previewUrl: `http://localhost:1234${img}` }))
        : [],
    });
    setEditMode(true);
    setVisible(true);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingProduct) return;

    try {
      await ProductService.updateProduct(editingProduct.id, newProduct);
      setVisible(false);
      setEditMode(false);
      loadProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?")) return;
    try {
      await ProductService.deleteProduct(productId);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-content-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex space-x-4 items-center ml-auto">
          <div className="ml-auto w-72 pt-3">
            <span className="p-input-icon-left w-full flex items-center pr-3">
              <i className="pi pi-search pl-3 text-gray-500" />
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Product"
                className="w-full pl-8"
              />
            </span>
          </div>
          <div className="pt-3">
            <Button
              label="Add New Product"
              icon="pi pi-plus"
              className="p-button-primary"
              onClick={() => {
                setEditMode(false);
                setEditingProduct(null);
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
                setVisible(true);
              }}
            />
          </div>
        </div>
      </div>

      <ProductTable products={products} handleEdit={handleEdit} handleDelete={handleDelete} />

      <ProductForm
        visible={visible}
        setVisible={setVisible}
        editMode={editMode}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleInputChange={handleInputChange}
        onImageUpload={onImageUpload}
        handleRemoveImage={handleRemoveImage}
        handleSubmit={handleSubmit}
        handleSaveEdit={handleSaveEdit}
        categoryOptions={[
          { label: "ประตูม้วน", value: "shutter" },
          { label: "อะไหล่ประตูม้วน", value: "shutter_parts" },
        ]}
        colorOptions={[
          { label: "ดำ (Black)", value: "black" },
          { label: "เทา (Gray)", value: "gray" },
          { label: "ชมพู (Pink)", value: "pink" },
          { label: "น้ำเงิน (Blue)", value: "blue" },
          { label: "เขียว (Green)", value: "green" },
          { label: "แดง (Red)", value: "red" },
          { label: "ขาว (White)", value: "white" },
        ]}
      />
    </div>
  );
};

export default ManageProducts;
