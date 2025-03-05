import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// PrimeReact
import { Carousel } from "primereact/carousel";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

// PrimeFlex
import "primeflex/primeflex.css";

// หมวดหมู่กรณีสินค้าไม่ใช่ชิ้นส่วน (is_part === false)
const normalCategoryOptions = [
  { label: "ทั้งหมด", value: null },
  { label: "ประตูม้วนแบบไฟฟ้า", value: "electric_shutter" },
  { label: "ประตูม้วนแบบรอกโซ่", value: "chain_electric_shutter" },
  { label: "ประตูม้วนแบบสปริง", value: "spring_shutter" },
];

// หมวดหมู่กรณีสินค้าเป็นชิ้นส่วน (is_part === true)
const partCategoryOptions = [
  { label: "ทั้งหมด", value: null },
  { label: "แผ่นประตูม้วน", value: "shutter_panel" },
  { label: "รางประตู", value: "door_track" },
  { label: "เพลา", value: "shaft" },
  { label: "สปริง", value: "spring" },
  { label: "ฝาครอบเพลา", value: "shaft_cover" },
  { label: "ตัวล็อกประตู", value: "door_lock" },
  { label: "มอเตอร์", value: "motor" },
  { label: "กล่องควบคุม", value: "control_box" },
  { label: "รีโมทคอนโทรล / ปุ่มควบคุม", value: "remote_control" },
  { label: "ระบบเซนเซอร์", value: "sensor_system" },
  { label: "แบตเตอรี่สำรอง", value: "backup_battery" },
  { label: "มือหมุนฉุกเฉิน", value: "emergency_crank" },
];

const checkLogin = () => {
  // ตัวอย่างการเช็คล็อกอิน (ในโปรเจ็กต์จริงอาจเช็ค token หรือ context)
  return localStorage.getItem("token") ? true : false;
};

const ProductAutoDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [installOption, setInstallOption] = useState(null); // ติดตั้ง/ไม่ติดตั้ง
  const [quantity, setQuantity] = useState(1); // จำนวน
  const [width, setWidth] = useState(""); // กว้าง
  const [length, setLength] = useState(""); // ยาว

  const isLoggedIn = checkLogin();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:1234/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // เลือกชุด category ตาม is_part
  const categoryOptions = product.is_part
    ? partCategoryOptions
    : normalCategoryOptions;

  // แปลงค่า category => label
  const matchedCategory = categoryOptions.find(
    (option) => option.value === product.category
  );
  const categoryLabel = matchedCategory ? matchedCategory.label : "ไม่ระบุ";

  // เตรียมรูปภาพสำหรับ Carousel
  const productImages =
    product.images?.map((img) => `http://localhost:1234${img}`) || [];

  // Render item แต่ละรูปใน Carousel
  const imageItemTemplate = (imageUrl) => {
    return (
      <img
        src={imageUrl}
        alt={product.name}
        style={{
          width: "100%",
          maxHeight: "350px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    );
  };

  // ถ้ายังไม่ล็อกอิน เมื่อกดซื้อหรือเพิ่มลงตะกร้าให้ไปหน้า /login
  const handleBuy = () => {
    if (!isLoggedIn) {
      window.location.href = "/login"; // หรือใช้ navigate("/login")
      return;
    }
    alert("กดซื้อสินค้า (ตัวอย่าง)");
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = "/login"; // หรือใช้ navigate("/login")
      return;
    }
    alert("เพิ่มลงตะกร้า (ตัวอย่าง)");
  };

  return (
    <div className="flex justify-content-center align-items-center p-4 mt-8">
      <div
        className="surface-card p-4 border-round shadow-2"
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        <div className="grid">
          {/* โซนแสดง Carousel รูปภาพ */}
          <div className="col-12 md:col-6 flex align-items-center justify-content-center">
            {productImages.length > 0 ? (
              <Carousel
                value={productImages}
                itemTemplate={imageItemTemplate}
                numVisible={1}
                numScroll={1}
                style={{ maxWidth: "400px", width: "100%" }}
              />
            ) : (
              <img
                src="https://via.placeholder.com/300"
                alt="NoImages"
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>

          <div className="col-12 md:col-6 mt-4 md:mt-0">
            <h2 className="mt-0">{product.name}</h2>

            {!product.is_part &&
              product.colors &&
              product.colors.length > 0 && (
                <div className="flex gap-3 mb-3">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              )}

            {!product.is_part && (
              <div className="mb-3 flex gap-3">
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="install1"
                    name="install"
                    value="ติดตั้ง"
                    onChange={(e) => setInstallOption(e.value)}
                    checked={installOption === "ติดตั้ง"}
                  />
                  <label htmlFor="install1" className="ml-2">
                    ติดตั้ง
                  </label>
                </div>
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="install2"
                    name="install"
                    value="ไม่ติดตั้ง"
                    onChange={(e) => setInstallOption(e.value)}
                    checked={installOption === "ไม่ติดตั้ง"}
                  />
                  <label htmlFor="install2" className="ml-2">
                    ไม่ติดตั้ง
                  </label>
                </div>
              </div>
            )}

            {!product.is_part && (
              <div className="mb-3">
                <div className="flex gap-2 mb-2 align-items-center">
                  <span>กว้าง:</span>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="เซนติเมตร"
                    className="p-inputtext p-component"
                    style={{ width: "100px" }}
                  />
                </div>
                <div className="flex gap-2 align-items-center">
                  <span>ยาว:</span>
                  <input
                    type="text"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="เซนติเมตร"
                    className="p-inputtext p-component"
                    style={{ width: "100px" }}
                  />
                </div>
              </div>
            )}

            <p className="text-2xl font-bold mb-1">
              {product.price
                ? `${Number(product.price).toLocaleString()} บาท`
                : "ไม่ระบุราคา"}
            </p>

            <p className="text-sm text-500">หมวดหมู่: {categoryLabel}</p>

            {product.description && (
              <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                {product.description}
              </p>
            )}

            <div className="flex align-items-center gap-2 mt-3">
              <label htmlFor="quantity" className="font-bold">
                จำนวน:
              </label>
              <InputNumber
                value={quantity}
                onValueChange={(e) => setQuantity(e.value)}
                min={1}
                showButtons
                buttonLayout="vertical" 
                incrementButtonIcon="pi pi-chevron-up"
                decrementButtonIcon="pi pi-chevron-down"
                style={{ width: "20rem" }} 
              />
            </div>

            <div className="mt-4 flex gap-3">
              <Button
                label="ซื้อ"
                icon="pi pi-shopping-cart"
                className="p-button-primary"
                onClick={handleBuy}
              />
              <Button
                label="เพิ่มลงตะกร้า"
                icon="pi pi-plus"
                className="p-button-outlined p-button-secondary"
                onClick={handleAddToCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAutoDetail;
