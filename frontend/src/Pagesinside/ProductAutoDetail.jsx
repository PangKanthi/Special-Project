import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerReviews from "./CustomerReviews component/CustomerReviews";

// PrimeReact
import { Carousel } from "primereact/carousel";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router-dom";

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
  return localStorage.getItem("token") ? true : false;
};

const ProductAutoDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [installOption, setInstallOption] = useState(null); // ติดตั้ง/ไม่ติดตั้ง
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1); // จำนวน
  const [width, setWidth] = useState(""); // กว้าง
  const [length, setLength] = useState(""); // ยาว
  const [thickness, setThickness] = useState(""); // หนา (เพิ่มใหม่)
  const [selectedColor, setSelectedColor] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = checkLogin();

  const handleIncrease = () => {
    setQuantity((prev) => (prev < product.stock_quantity ? prev + 1 : prev));
  };

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

  const handleBuy = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    handleAddToCart(); // เพิ่มสินค้าเข้าตะกร้า
    navigate("/shop-cart"); // ไปที่หน้าตะกร้าสินค้า
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าหรือไม่
    const existingItem = cart.find(item => item.product.id === product.id);
    const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  
    if (totalQuantity > product.stock_quantity) {
      alert(`สินค้าคงเหลือในสต็อกมี ${product.stock_quantity} ชิ้นเท่านั้น`);
      return;
    }
  
    const cartItem = {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images?.map(img => `http://localhost:1234${img}`) || ["https://via.placeholder.com/300"]
      },
      quantity,
      installation: installOption,
      selectedColor,
      dimensions: { width, height: length, thickness }
    };
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // แจ้งให้ `UserMenu` อัปเดตตะกร้า
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-content-center align-items-center mt-8">
        <div className="surface-card p-4 border-round shadow-2" style={{ maxWidth: "1000px", width: "100%" }}>
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
                        onClick={() => setSelectedColor(color)} // กดแล้วเปลี่ยนค่า
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: selectedColor === color ? "3px solid #ffffff" : "1px solid #ccc", // ไฮไลต์สีที่ถูกเลือก
                          cursor: "pointer",
                          boxShadow: selectedColor === color ? "0 0 5px rgba(0,0,0,0.5)" : "none", // เพิ่มเอฟเฟกต์เงา
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
              <p>ขนาด ( 2000/ตร.ม. )</p>
              {!product.is_part && (
                <div className="flex">
                  <div className="flex align-items-center">
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="กว้าง = ตร.ม."
                      className="p-inputtext p-component"
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div className="flex align-items-center pl-2">
                    <input
                      type="text"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="ยาว = ตร.ม."
                      className="p-inputtext p-component"
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div className="flex align-items-center pl-2">
                    <input
                      type="text"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      placeholder="หนา = มิน"
                      className="p-inputtext p-component"
                      style={{ width: "100px" }}
                    />
                  </div>
                </div>
              )}

              <p className="text-2xl font-bold mb-3">
                {product.price
                  ? `${Number(product.price).toLocaleString()} บาท`
                  : "ไม่ระบุราคา"}
              </p>

              <div className="flex-auto">
                <label htmlFor="minmax-buttons" className="font-bold block mb-2">
                  จำนวน:
                </label>
                <div className="flex align-items-center">
                  <Button
                    label="-"
                    className="p-button-secondary"
                    onClick={handleDecrease}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      fontSize: '30px',
                      justifyContent: 'center',
                      paddingBottom: '14px'
                    }}
                  />
                  <InputText
                    value={quantity}
                    readOnly
                    style={{
                      width: '57px',
                      height: '30px',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      border: '1px solid #424242',
                    }}
                  />
                  <Button
                    label="+"
                    className="p-button-secondary"
                    onClick={handleIncrease}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      fontSize: '30px',
                      justifyContent: 'center',
                      paddingBottom: '14px'
                    }}
                  />
                </div>
              </div>

              <p
                onClick={() => setShowDialog(true)}
                style={{ color: 'red', cursor: 'pointer', textDecoration: 'underline', fontSize: '17px' }}
              >
                *รายละเอียดและคำแจ้งเตือนเมื่อซื้อ
              </p>
              <Dialog
                visible={showDialog}
                style={{ width: '1080px', height: '840px' }}
                onHide={() => setShowDialog(false)}
              >
                <div className='lg:flex-1 flex justify-content-center flex-wrap'>
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
                <div className='pl-5 pr-5'>
                  <div>
                    <h3>รายละเอียด</h3>
                    <p className="text-sm text-500">หมวดหมู่: {categoryLabel}</p>
                  </div>
                  <div className='pt-8'>
                    <h3>การรับประกัน</h3>
                    {product.description && (
                      <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </Dialog>

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
      <div className="flex justify-content-center">
        <div style={{ maxWidth: "1000px", width: "100%" }}>
          <CustomerReviews />
        </div>
      </div>
    </div>
  );
};

export default ProductAutoDetail;
