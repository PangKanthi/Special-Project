import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CustomerReviews from "./CustomerReviews component/CustomerReviews";

import { Carousel } from "primereact/carousel";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

import useLocationData from "../Hooks/useLocationData";
import { calculateTotalDoorPrice } from "../utils";


import "primeflex/primeflex.css";

const normalCategoryOptions = [
  { label: "ทั้งหมด", value: null },
  { label: "ประตูม้วนไฟฟ้า", value: "electric_rolling_shutter" },
  { label: "ประตูม้วนแบบรอกโซ่", value: "chain_electric_shutter" },
  { label: "ประตูม้วนมือดึง", value: "manual_rolling_shutter" },
];

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


  const { doorConfigData } = useLocationData();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [installOption, setInstallOption] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("default");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [thickness, setThickness] = useState("");
  const [thicknessStr, setThicknessStr] = useState("0.6-0.7 mm (เบอร์ 22)");
  const [area, setArea] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = checkLogin();

  // (product.category, width, height, ThicknessString)
  // const {result, errorMessage } = calculateTotalDoorPrice("chain_electric_shutter", 2, 2, '0.6-0.7 mm (เบอร์ 22)');

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

  const handleCalculate = async () => {
    // if (!product || !width || !length || !thicknessStr) {
    //   // setError("กรุณากรอกข้อมูลให้ครบ");
    //   console.log("กรอกให้ครบ")
    //   return;
    // }

    const { result, errorMessage } = await calculateTotalDoorPrice(
      // product.category,
      // parseFloat(width),
      // parseFloat(length),
      // thicknessStr
      "chain_electric_shutter",
      4,
      5,
      "0.6-0.7 mm (เบอร์ 22)"
    );

    console.log("DoorPrice", result)
    

    // setPrice(result);
    // setError(errorMessage);
  };

  handleCalculate();

  const [pricePerSqm, setPricePerSqm] = useState(null);





  const handleIncrease = () => {
    setQuantity((prev) => (prev < product.stock_quantity ? prev + 1 : prev));
  };

  if (!product) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const categoryOptions = product.is_part
    ? partCategoryOptions
    : normalCategoryOptions;

  const matchedCategory = categoryOptions.find(
    (option) => option.value === product.category
  );
  const categoryLabel = matchedCategory ? matchedCategory.label : "ไม่ระบุ";

  const productImages =
    product.images?.map((img) => `http://localhost:1234${img}`) || [];

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

    handleAddToCart();
    navigate("/shop-cart");
  };

  const isOutOfStock = product.stock_quantity === 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    let finalColor = product.is_part ? "" : selectedColor || "default";
    let finalInstallOption = product.is_part ? "" : installOption;
    let finalWidth = product.is_part ? 0 : width ? parseFloat(width) : 0;
    let finalLength = product.is_part ? 0 : length ? parseFloat(length) : 0;
    let finalThickness = product.is_part
      ? 0
      : thickness
        ? parseFloat(thickness)
        : 0;

    if (
      !product.is_part &&
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณาเลือกสี",
        detail: "โปรดเลือกสีของสินค้าก่อนเพิ่มลงตะกร้า",
        life: 3000,
      });
      return;
    }

    if (!product.is_part && !installOption) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณาเลือกตัวเลือกการติดตั้ง",
        detail: "กรุณาเลือกว่าจะติดตั้งสินค้าหรือไม่",
        life: 3000,
      });
      return;
    }

    if (!product.is_part && (!width || !length || !thickness)) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณากรอกขนาดให้ครบ",
        detail: "โปรดกรอก กว้าง, ยาว และ หนา ให้ครบทุกช่อง",
        life: 3000,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:1234/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          price: product.price,
          color: finalColor,
          width: finalWidth,
          length: finalLength,
          thickness: finalThickness,
          installOption: finalInstallOption,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");
      }

      toast.current.show({
        severity: "success",
        summary: "✅ เพิ่มสินค้าลงตะกร้า",
        detail: `${product.name} ถูกเพิ่มลงตะกร้าแล้ว`,
        life: 3000,
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ ไม่สามารถเพิ่มสินค้า",
        detail: error.message,
        life: 3000,
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="flex justify-content-center align-items-center mt-8">
        <div
          className="surface-card p-4 border-round shadow-2"
          style={{ maxWidth: "1000px", width: "100%" }}
        >
          <div className="grid">
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
              {isOutOfStock && (
                <div className="p-message p-message-error text-red-600 text-lg font-bold">
                  ❌ สินค้าหมด ไม่สามารถสั่งซื้อได้
                </div>
              )}
              {!product.is_part &&
                product.colors &&
                product.colors.length > 0 && (
                  <div className="flex gap-3 mb-3">
                    {product.colors?.map((color) => (
                      <div
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          border:
                            selectedColor === color
                              ? "3px solid #ffffff"
                              : "1px solid #ccc",
                          cursor: "pointer",
                          boxShadow:
                            selectedColor === color
                              ? "0 0 5px rgba(0,0,0,0.5)"
                              : "none",
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
                {/* ถ้า totalPrice มีค่า ก็แสดงผล */}
                {/* {totalPrice
                  ? `${Number(totalPrice).toLocaleString()} บาท`
                  : "จุดระบุราคา"
                } */}
                1 บาท
              </p>

              <div className="flex-auto">
                <label
                  htmlFor="minmax-buttons"
                  className="font-bold block mb-2"
                >
                  จำนวน:
                </label>
                <div className="flex align-items-center">
                  <Button
                    label="-"
                    className="p-button-secondary"
                    onClick={handleDecrease}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      fontSize: "30px",
                      justifyContent: "center",
                      paddingBottom: "14px",
                    }}
                  />
                  <InputText
                    value={quantity}
                    readOnly
                    style={{
                      width: "57px",
                      height: "30px",
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold",
                      border: "1px solid #424242",
                    }}
                  />
                  <Button
                    label="+"
                    className="p-button-secondary"
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock_quantity} // Prevent exceeding stock
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      fontSize: "30px",
                      justifyContent: "center",
                      paddingBottom: "14px",
                    }}
                  />
                </div>
                <p className="text-sm mt-2">
                  สินค้าคงเหลือ: {product.stock_quantity} ชิ้น
                </p>
              </div>

              <p
                onClick={() => setShowDialog(true)}
                style={{
                  color: "red",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "17px",
                }}
              >
                *รายละเอียดและคำแจ้งเตือนเมื่อซื้อ
              </p>
              <Dialog
                visible={showDialog}
                style={{ width: "1080px", height: "840px" }}
                onHide={() => setShowDialog(false)}
              >
                <div className="lg:flex-1 flex justify-content-center flex-wrap">
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
                <div className="pl-5 pr-5">
                  <div>
                    <h3>รายละเอียด</h3>
                    {product.description && (
                      <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-8">
                    <h3>การรับประกัน</h3>
                    {product.warranty && (
                      <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                        {product.warranty}
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
