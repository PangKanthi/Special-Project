import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShopOrderHeader from "./ShopOrder Component/ShopOrderHeader";
import CartItem from "./ShopOrder Component/CartItem";
import SummaryCard from "./ShopOrder Component/SummaryCard";
import SlipPayment from "./ShopOrder Component/SlipPayment";
import { Card } from "primereact/card";

function ShopOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = location.state || {};
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ images: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("http://localhost:1234/api/addresses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setAddresses(data.data || []);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงที่อยู่:", err);
      }
    };
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:1234/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };

    fetchAddresses();
    fetchUser();
  }, []);

  const handleOrderConfirmation = async () => {
    if (!selectedAddress) {
      alert("กรุณาเลือกที่อยู่ก่อนทำการสั่งซื้อ");
      return;
    }
    if (!form.images.length) {
      alert("กรุณาอัปโหลดสลิปโอนเงินก่อน");
      return;
    }

    const formData = new FormData();
    formData.append("slip", form.images[0].file);
    formData.append("amount", grandTotal);

    try {
      const uploadResponse = await fetch(
        "http://localhost:1234/api/upload-slip",
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadResult.error);

      const orderData = {
        cart,
        slipUrl: uploadResult.imageUrl,
        addressId: selectedAddress.id,
      };

      const orderResponse = await fetch("http://localhost:1234/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) throw new Error("ไม่สามารถสร้างคำสั่งซื้อได้");

      alert("สั่งซื้อสำเร็จ!");
      navigate("/shop-order-info");
    } catch (error) {
      console.error("❌ API Error:", error.message);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  const totalProductPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalInstallationFee = cart.reduce(
    (sum, item) =>
      sum + (item.installOption === "ติดตั้ง" ? 150 * item.quantity : 0),
    0
  );

  const VAT_RATE = 0.07;
  const SHIPPING_COST = totalProductPrice > 1000 ? 0 : 50;
  const DISCOUNT = totalProductPrice > 2000 ? 200 : 0;
  const vatAmount = totalProductPrice * VAT_RATE;
  const grandTotal =
    totalProductPrice +
    totalInstallationFee +
    vatAmount +
    SHIPPING_COST -
    DISCOUNT;

  return (
    <div className="lg:flex justify-content-center pt-6">
      <div className="px-4 sm:px-6 md:px-8 lg:mr-8">
        <ShopOrderHeader
          addresses={addresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          setSelectedAddressIndex={setSelectedAddressIndex}
          user={user}
        />
        <div className="mt-4">
          {cart.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>
      </div>
      <div className="pl-5 pr-5 lg:pt-7">
        <Card>
          <SummaryCard
            totalProductPrice={totalProductPrice}
            totalInstallationFee={totalInstallationFee}
            grandTotal={grandTotal}
          />
        </Card>
        <Card>
          <SlipPayment
            form={form}
            setForm={setForm}
            grandTotal={grandTotal}
            handleOrderConfirmation={handleOrderConfirmation}
          />
        </Card>
      </div>
    </div>
  );
}

export default ShopOrder;
