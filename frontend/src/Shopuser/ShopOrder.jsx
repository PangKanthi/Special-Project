import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShopOrderHeader from "./ShopOrder Component/ShopOrderHeader";
import CartItem from "./ShopOrder Component/CartItem";
import SummaryCard from "./ShopOrder Component/SummaryCard";
import { Card } from "primereact/card";

function ShopOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ images: [] });
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("https://api.d-dayengineering.com/api/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลตะกร้าได้");

        const data = await response.json();
        setCart(data.items || []);
      } catch (error) {
        console.error("❌ API Error:", error.message);
      }
    };
    const fetchAddresses = async () => {
      try {
        const res = await fetch("https://api.d-dayengineering.com/api/addresses", {
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
        const res = await fetch("https://api.d-dayengineering.com/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };
    fetchCart();
    fetchAddresses();
    fetchUser();
  }, []);

  const handleOrderConfirmation = async () => {
    if (!selectedAddress) {
      alert("กรุณาเลือกที่อยู่ก่อนทำการสั่งซื้อ");
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product?.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        addressId: selectedAddress.id,
        orderItems,
        totalAmount: grandTotal,
      };

      const orderResponse = await fetch("https://api.d-dayengineering.com/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) throw new Error("ไม่สามารถสร้างคำสั่งซื้อได้");

      await fetch("https://api.d-dayengineering.com/api/cart/clear", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      alert("สั่งซื้อสำเร็จ!");
      navigate("/shop-order-info");
    } catch (error) {
      console.error("❌ API Error:", error.message);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
    }
  };

  const totalProductPrice = cart.reduce((sum, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    return sum + price * quantity;
  }, 0);

  const VAT_RATE = 0.07;
  const vatAmount = totalProductPrice * VAT_RATE;
  const grandTotal = totalProductPrice + vatAmount;

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
            grandTotal={grandTotal}
            onConfirmOrder={handleOrderConfirmation}
          />
        </Card>
      </div>
    </div>
  );
}

export default ShopOrder;
