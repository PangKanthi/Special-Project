import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";

function ShopCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // ดึงข้อมูลตะกร้า
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลตะกร้าได้");

        const data = await response.json();
        setCart(data.items || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCart();
  }, []);

  // ฟังก์ชันลบสินค้าออกจากตะกร้า (ใช้ cart_item.id)
  const handleRemoveItem = async (cartItemId) => {
    if (!cartItemId) {
      console.error("❌ Error: cartItemId is undefined or null");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cartItemId }), // ส่ง cartItemId
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "ลบสินค้าออกจากตะกร้าไม่สำเร็จ");
      }

      // อัปเดต UI
      setCart(cart.filter((item) => item.id !== cartItemId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("❌ API Error:", error.message);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  // ฟังก์ชันอัปเดตจำนวนของสินค้า (กดปุ่ม + หรือ -)
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return; // ไม่อนุญาตให้ลดต่ำกว่า 1

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/cart/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ cartItemId, newQuantity }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "ไม่สามารถอัปเดตจำนวนสินค้าได้");
      }

      const data = await response.json();

      // ปรับ state ในฝั่ง Front-end
      const updatedCart = cart.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCart(updatedCart);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("❌ API Error:", error.message);
      alert("เกิดข้อผิดพลาดในการอัปเดตจำนวนสินค้า");
    }
  };

  // ถ้าตะกร้าว่าง
  if (!cart || cart.length === 0) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ minHeight: "50vh", padding: "1rem" }}
      >
        <div
          className="surface-card p-6 shadow-2 border-round-lg text-center"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <i className="pi pi-shopping-cart text-6xl text-blue-500 mb-4"></i>
          <h2 className="text-blue-600">ตะกร้าสินค้าว่าง</h2>
          <p className="text-gray-600">ยังไม่มีสินค้าในตะกร้า กรุณาเลือกซื้อสินค้า</p>
          <Button
            label="เลือกซื้อสินค้า"
            className="p-button-primary w-full mt-3"
            onClick={() => navigate("/automatic")}
          />
        </div>
      </div>
    );
  }

  // สั่งซื้อ
  const handleOrder = async () => {
    navigate("/shop-order", { state: { cart } });
  };

  // คำนวณราคารวมสินค้า
  const totalProductPrice = cart.reduce((sum, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    return sum + price * quantity;
  }, 0);

  const VAT_RATE = 0.07;
  const vatAmount = totalProductPrice * VAT_RATE;
  const grandTotal = totalProductPrice + vatAmount;

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:pl-8 pr-8">
      <div className="lg:flex-1 flex justify-content-between flex-wrap pt-8">
        <div className="lg:pl-8">
          <div className="lg:pl-5">
            <h2>ตะกร้าสินค้า</h2>
          </div>

          {cart.map((item, index) => (
            <div key={index} className="lg:flex border-b pb-4 mb-4">
              <div className="pt-5">
                {item.product?.images && item.product.images.length > 0 ? (
                  <Carousel
                    value={item.product.images.map(
                      (img) => `${process.env.REACT_APP_API}${img}`
                    )}
                    numVisible={1}
                    numScroll={1}
                    itemTemplate={(imageUrl) => (
                      <img
                        src={imageUrl}
                        alt="Product"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          height: "auto",
                          maxHeight: "300px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          backgroundColor: "#fff",
                        }}
                      />
                    )}
                    style={{ maxWidth: "400px", width: "100%" }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/300"
                    alt="สินค้าตัวนี้"
                    style={{ width: "300px", height: "300px", objectFit: "cover" }}
                  />
                )}
              </div>

              <div className="pl-4">
                <div className="flex-1 text-left">
                  <h3 className="text-sm lg:text-xl">
                    {item.product?.name || "ไม่พบข้อมูลสินค้า"}
                  </h3>

                  {!item.product?.is_part && (
                    <p className="text-xs lg:text-base">
                      <strong>ตัวเลือกติดตั้ง:</strong>{" "}
                      {item.installOption || "ไม่ระบุ"}
                    </p>
                  )}
                  {!item.product?.is_part && (
                    <p className="text-xs lg:text-base flex items-center">
                      สีที่เลือก:
                      <span
                        style={{
                          backgroundColor: item.color || "transparent",
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          marginLeft: "10px",
                        }}
                      ></span>
                    </p>
                  )}
                  {!item.product?.is_part && (
                    <p className="text-xs lg:text-base sm:text-sm">
                      กว้าง {item.width || "-"} ตร.ม. | ยาว {item.length || "-"} ตร.ม. | หนา{" "}
                      {item.thickness || "-"} มม.
                    </p>
                  )}

                  {/* ปุ่ม + - จำนวนสินค้า (ปรับให้สวยขึ้น) */}
                  <div className="flex align-items-center my-2">
                    <Button
                      icon="pi pi-minus"
                      className="p-button-rounded p-button-text p-button-sm p-button-outlined mr-2"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    />
                    <span className="mx-2 text-xl font-semibold">{item.quantity}</span>
                    <Button
                      icon="pi pi-plus"
                      className="p-button-rounded p-button-text p-button-sm p-button-outlined"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    />
                  </div>

                  <p className="text-sm lg:text-base">
                    <strong>ราคาต่อชิ้น:</strong> ฿
                    {Number(item.price ?? item.product?.price ?? 0).toLocaleString()}
                  </p>
                  <p className="text-sm font-bold text-red-500 lg:text-lg">
                    <strong>ราคารวม:</strong> ฿
                    {Number(
                      (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1)
                    ).toLocaleString()}
                  </p>
                </div>

                {/* ปุ่มลบสินค้าออกจากตะกร้า */}
                <Button
                  label="ลบออก"
                  size="small"
                  icon="pi pi-trash"
                  className="p-button-danger text-xs lg:mt-2"
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* สรุปยอดด้านขวา */}
        <div className="w-full lg:w-auto pt-7 flex justify-end">
          <Card
            style={{
              width: "500px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              backgroundColor: "#f6f6f6",
              height: "350px",
            }}
          >
            <div className="flex justify-content-between text-lg">
              <p>ยอดรวมสินค้า</p>
              <p>฿ {totalProductPrice.toLocaleString()}</p>
            </div>

            <div className="flex justify-content-between text-lg">
              <p>ภาษีมูลค่าเพิ่ม (7%)</p>
              <p>฿ {vatAmount.toLocaleString()}</p>
            </div>

            <div className="border-t border-gray-300 my-3"></div>

            <div
              className="flex justify-content-between text-lg font-bold border-t pt-2"
              style={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}
            >
              <p>ยอดรวมทั้งหมด</p>
              <p>฿ {grandTotal.toLocaleString()}</p>
            </div>

            <Button
              label="สั่งซื้อ"
              onClick={handleOrder}
              className="w-full bg-blue-600 text-white py-2 text-lg font-bold rounded"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ShopCart;
