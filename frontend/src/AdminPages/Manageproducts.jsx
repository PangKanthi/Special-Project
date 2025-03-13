import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import ProductService from "./Manageproducts component/ProductService";
import ProductTable from "./Manageproducts component/ProductTable";
import ProductForm from "./Manageproducts component/ProductForm";

// 1) import useLocationData เพื่อดึง doorConfig มาจาก doorConfig.json
import useLocationData from "../Hooks/useLocationData";

const ManageProducts = () => {
  // 2) ใช้งาน useLocationData เพื่อดึง doorConfig
  const { doorConfig, shutter_partsConfig } = useLocationData();
  useEffect(() => {
    console.log("🔍 doorConfig:", doorConfig);
    console.log("🔍 shutter_partsConfig:", shutter_partsConfig);
  }, [doorConfig, shutter_partsConfig]);


  // 3) สร้าง map ระหว่างค่าที่ Dropdown ส่งมา (manual_rolling_shutter ฯลฯ) ไปเป็นคีย์ใน doorConfig (MANUAL, CHAIN, ELECTRIC)
  const categoryMap = {
    manual_rolling_shutter: "manual_rolling_shutter",
    chain_electric_shutter: "chain_electric_shutter",
    electric_rolling_shutter: "electric_rolling_shutter",
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

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // 4) newProduct คือ State ที่จะถูกส่งไปให้ ProductForm
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    colors: [],
    description: "",
    warranty: "",
    images: [],
    // ในฟอร์มมีฟิลด์ Product Type (is_part) ด้วย ให้เตรียมไว้นิดนึง
    is_part: undefined,
  });

  // โหลดสินค้าทั้งหมดจาก backend ทันทีที่ component mount
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

  // แปลง BOM array ให้เป็นข้อความ
  const formatBOM = (bomArray) => {
    if (!bomArray) return "";
    let lines = bomArray.map((item) => {
      // เช็คว่ามี quantityPerMeter หรือ quantity
      if (item.quantityPerMeter !== undefined) {
        return `- ${item.part} ${item.quantityPerMeter} ${item.unit}`;
      } else if (item.quantity !== undefined) {
        return `- ${item.part} ${item.quantity} ${item.unit}`;
      }
      return `- ${item.part}`;
    });
    return `\nรายการ:\n` + lines.join("\n");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "category") {
      const configKey = categoryMap[value];
  
      // ตรวจสอบก่อนว่าเป็นอะไหล่ประตูม้วน
      if (configKey && shutter_partsConfig?.data?.[configKey]) {
        const { description, warranty } = shutter_partsConfig.data[configKey];
  
        setNewProduct((prev) => ({
          ...prev,
          category: value,
          description: description,  // ✅ กรอก description อัตโนมัติ
          warranty: warranty,        // ✅ กรอก warranty อัตโนมัติ
        }));
        return;
      }
  
      // ถ้าไม่ใช่อะไหล่ ก็ใช้ doorConfig ตามเดิม
      if (configKey && doorConfig?.data?.[configKey]) {
        const { description, warranty, bom } = doorConfig.data[configKey];
        let bomText = formatBOM(bom);
        let fullDesc = description + bomText;
  
        setNewProduct((prev) => ({
          ...prev,
          category: value,
          description: fullDesc,
          warranty: warranty,
        }));
        return;
      }
    }
  
    // อัปเดตค่าอื่นๆ ตามปกติ
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  

  // ฟังก์ชันจัดการ upload ไฟล์รูป
  const onImageUpload = (event) => {
    const uploadedFiles = event.files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewProduct((prev) => {
      const existingFileNames = new Set(prev.images.map((img) => img.file?.name));
      const uniqueFiles = uploadedFiles.filter(
        (img) => !existingFileNames.has(img.file.name)
      );
      return {
        ...prev,
        images: [...prev.images, ...uniqueFiles],
      };
    });
  };

  // ลบรูปออกจาก state
  const handleRemoveImage = (imageToRemove, event) => {
    event.stopPropagation();
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

    // ตรวจสอบเฉพาะฟิลด์ที่ทุก Product ต้องมี
    if (!newProduct.name || !newProduct.category) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนทำการเพิ่มสินค้า");
      return;
    }

    // ตรวจสอบ Price / Stock เฉพาะกรณี is_part === true
    if (
      newProduct.is_part === true &&
      (!newProduct.price || !newProduct.stock_quantity)
    ) {
      alert("กรุณากรอก Price และ Stock Quantity สำหรับอะไหล่ประตูม้วน");
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

  // กดปุ่ม Edit ในตาราง
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
        ? product.images.map((img) => ({
          previewUrl: `http://localhost:1234${img}`,
        }))
        : [],
      is_part: product.is_part, // ถ้ามี
    });
    setEditMode(true);
    setVisible(true);
  };

  // บันทึกการแก้ไขสินค้า
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

  // ลบสินค้า
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
        <h1 className="text-2xl font-bold">การจัดการสินค้า</h1>
        <div className="flex space-x-4 items-center ml-auto">
          <div className="ml-auto w-72 pt-3">
            <span className="p-input-icon-left w-full flex items-center pr-3">
              <i className="pi pi-search pl-3 text-gray-500" />
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหา สินค้า"
                className="w-full pl-8"
              />
            </span>
          </div>
          <div className="pt-3">
            <Button
              label="เพิ่มสินค้าใหม่"
              icon="pi pi-plus"
              className="p-button-primary"
              onClick={() => {
                setEditMode(false);
                setEditingProduct(null);
                // รีเซ็ต newProduct ใหม่
                setNewProduct({
                  name: "",
                  category: "",
                  price: "",
                  stock_quantity: "",
                  colors: [],
                  description: "",
                  warranty: "",
                  images: [],
                  is_part: undefined,
                });
                setVisible(true);
              }}
            />
          </div>
        </div>
      </div>

      <ProductTable
        products={products}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        categoryOptions={{
          shutter: [
            { label: "ประตูม้วนแบบมือดึง", value: "manual_rolling_shutter" },
            { label: "ประตูม้วนแบบรอกโซ่", value: "chain_electric_shutter" },
            { label: "ประตูม้วนแบบไฟฟ้า", value: "electric_rolling_shutter" },
          ],
          shutter_parts: [
            { label: "แผ่นประตูม้วน", value: "แผ่นประตูม้วน" },
            { label: "เสารางประตูม้วน", value: "เสารางประตูม้วน" },
            { label: "แกนเพลาประตูม้วน", value: "แกนเพลาประตูม้วน" },
            { label: "กล่องเก็บม้วนประตู", value: "กล่องเก็บม้วนประตู" },
            { label: "ตัวล็อกประตูม้วน", value: "ตัวล็อกประตูม้วน" },
            { label: "กุญแจประตูม้วน", value: "กุญแจประตูม้วน" },
            { label: "รอกโซ่ประตูม้วน", value: "รอกโซ่ประตูม้วน" },
            { label: "ชุดเฟืองโซ่ประตูม้วน", value: "ชุดเฟืองโซ่ประตูม้วน" },
            { label: "โซ่ประตูม้วน", value: "โซ่ประตูม้วน" },
            { label: "ตัวล็อคโซ่สาว", value: "ตัวล็อคโซ่สาว" },
            { label: "ชุดมอเตอร์ประตูม้วน", value: "ชุดมอเตอร์ประตูม้วน" },
            { label: "สวิตช์กดควบคุม", value: "สวิตช์กดควบคุม" },
          ],
        }}
      />

      {/* Dialog ฟอร์ม เพิ่ม/แก้ไข */}
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
        colorOptions={[
          { label: "ไม่มีสี (Colorless)", value: "colorless" },
          { label: "ดำ (Black)", value: "black" },
          { label: "เทา (Gray)", value: "gray" },
          { label: "ชมพู (Pink)", value: "pink" },
          { label: "น้ำเงิน (Blue)", value: "blue" },
          { label: "เขียว (Green)", value: "green" },
          { label: "แดง (Red)", value: "red" },
          { label: "ขาว (White)", value: "white" },
        ]}
        // ส่วน Category Options แบ่งเป็นประตูม้วน / อะไหล่
        categoryOptions={{
          shutter: [
            { label: "ประตูม้วนแบบมือดึง", value: "manual_rolling_shutter" },
            { label: "ประตูม้วนแบบรอกโซ่", value: "chain_electric_shutter" },
            { label: "ประตูม้วนแบบไฟฟ้า", value: "electric_rolling_shutter" },
          ],
          shutter_parts: [
            { label: "แผ่นประตูม้วน", value: "แผ่นประตูม้วน" },
            { label: "เสารางประตูม้วน", value: "เสารางประตูม้วน" },
            { label: "แกนเพลาประตูม้วน", value: "แกนเพลาประตูม้วน" },
            { label: "กล่องเก็บม้วนประตู", value: "กล่องเก็บม้วนประตู" },
            { label: "ตัวล็อกประตูม้วน", value: "ตัวล็อกประตูม้วน" },
            { label: "กุญแจประตูม้วน", value: "กุญแจประตูม้วน" },
            { label: "รอกโซ่ประตูม้วน", value: "รอกโซ่ประตูม้วน" },
            { label: "ชุดเฟืองโซ่ประตูม้วน", value: "ชุดเฟืองโซ่ประตูม้วน" },
            { label: "โซ่ประตูม้วน", value: "โซ่ประตูม้วน" },
            { label: "ตัวล็อคโซ่สาว", value: "ตัวล็อคโซ่สาว" },
            { label: "ชุดมอเตอร์ประตูม้วน", value: "ชุดมอเตอร์ประตูม้วน" },
            { label: "สวิตช์กดควบคุม", value: "สวิตช์กดควบคุม" },
          ],
        }}
      />
    </div>
  );
};

export default ManageProducts;
