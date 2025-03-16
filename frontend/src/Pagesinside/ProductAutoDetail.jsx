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
import { fetchDoorConfig } from "../services/doorConfigService";

import "primeflex/primeflex.css";

const normalCategoryOptions = [
  { label: "ทั้งหมด", value: null },
  { label: "ประตูม้วนแบบไฟฟ้า", value: "electric_rolling_shutter" },
  { label: "ประตูม้วนแบบรอกโซ่", value: "chain_electric_shutter" },
  { label: "ประตูม้วนแบบมือดึง", value: "manual_rolling_shutter" },
];


const partCategoryOptions = [
  { label: "ทั้งหมด", value: null },
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
];

const checkLogin = () => {
  return localStorage.getItem("token") ? true : false;
};

const ProductAutoDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [installOption, setInstallOption] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("default");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [thickness, setThickness] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const toast = useRef(null);
  const isLoggedIn = checkLogin();

  const [thicknessOptions, setThicknessOptions] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        if (!product?.category) return;

        const data = await fetchDoorConfig();
        if (data[product.category]) {
          const allThickness = new Set();

          data[product.category].priceTiers?.forEach((tier) => {
            allThickness.add(tier.thickness);
          });

          setThicknessOptions([...allThickness]);
        } else {
          setThicknessOptions([]);
        }
      } catch (error) {
        console.error("Error fetching door config:", error);
      }
    };

    loadConfig();
  }, [product?.category]);

  const handleCalculate = async () => {
    if (!product || !width || !length || !selectedThickness) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const { result, errorMessage } = await calculateTotalDoorPrice(
      product.category,
      parseFloat(width),
      parseFloat(length),
      selectedThickness
    );

    setTotalPrice(result);
    setErrorMessage(errorMessage);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
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
    product.images?.map((img) => `${process.env.REACT_APP_API}${img}`) || [];

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

  const handleBuy = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    const isPart = product.is_part;

    if (!isPart && totalPrice === null) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณาคำนวณราคาก่อน",
        detail: "โปรดกดปุ่ม 'คำนวณราคา' ก่อนซื้อสินค้า",
        life: 3000,
      });
      return;
    }

    if (
      !isPart &&
      (!selectedColor ||
        !installOption ||
        !width ||
        !length ||
        !selectedThickness)
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณากรอกข้อมูลให้ครบ",
        detail: "โปรดกรอกข้อมูลทั้งหมดให้ครบถ้วนก่อนดำเนินการซื้อ",
        life: 3000,
      });
      return;
    }

    await handleAddToCart();
    window.location.href = "/shop-cart";
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    const isPart = product.is_part;

    if (!isPart && totalPrice === null) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณาคำนวณราคาก่อน",
        detail: "โปรดกดปุ่ม 'คำนวณราคา' ก่อนเพิ่มสินค้าลงตะกร้าหรือซื้อสินค้า",
        life: 3000,
      });
      return;
    }

    const finalColor = isPart ? "" : selectedColor || "default";
    const finalInstallOption = isPart ? "" : installOption;
    const finalWidth = isPart ? 0 : width ? parseFloat(width) : 0;
    const finalLength = isPart ? 0 : length ? parseFloat(length) : 0;
    const finalThickness = isPart
      ? ""
      : thickness
      ? parseFloat(thickness)
      : selectedThickness;

    if (
      !isPart &&
      (!selectedColor || !installOption || !width || !length || !finalThickness)
    ) {
      toast.current?.show({
        severity: "warn",
        summary: "⚠️ กรุณากรอกข้อมูลให้ครบ",
        detail: "โปรดกรอกข้อมูลทั้งหมดให้ครบถ้วนก่อนดำเนินการ",
        life: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          price: isPart ? product.price : totalPrice,
          color: finalColor,
          width: finalWidth,
          length: finalLength,
          thickness: finalThickness,
          installOption: finalInstallOption,
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ");

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
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
              {!product.is_part && (
                <div>
                  <h4>กรุณากรอกขนาด กว้าง ยาว หน่วยเป็น เมตร และ เลือกความหนา</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="กว้าง = ม."
                      className="p-inputtext p-component"
                      style={{ width: "100px", height: "55px" }}
                    />
                    
                    <input
                      type="text"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="ยาว = ม."
                      className="p-inputtext p-component"
                      style={{ width: "100px", height: "55px" }}
                    />
                    <Dropdown
                      value={selectedThickness}
                      onChange={(e) => setSelectedThickness(e.value)}
                      options={thicknessOptions}
                      optionLabel="name"
                      placeholder="เลือกความหนา"
                      className="p-inputtext p-component"
                      style={{ width: "250px" }}
                    />
                  </div>
                  <div className="flex flex-column mt-3">
                    <Button
                      label="คำนวณราคาประตูม้วนต่อบาน"
                      onClick={handleCalculate}
                      className="p-button-primary"
                    />

                    {totalPrice !== null && (
                      <p className="text-2xl font-bold mt-3">
                        ราคาประตูต่อบาน: {totalPrice.toLocaleString()} บาท
                      </p>
                    )}

                    {errorMessage && (
                      <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex-auto">
                <label
                  htmlFor="minmax-buttons"
                  className="font-bold block mb-2 mt-1"
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
