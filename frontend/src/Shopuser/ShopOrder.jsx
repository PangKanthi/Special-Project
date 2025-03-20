import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShopOrderHeader from "./ShopOrder Component/ShopOrderHeader";
import CartItem from "./ShopOrder Component/CartItem";
import SummaryCard from "./ShopOrder Component/SummaryCard";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";

function ShopOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ images: [] });
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const toast = useRef(null);

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
        console.error("❌ API Error:", error.message);
      }
    };
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/addresses`, {
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
        const res = await fetch(`${process.env.REACT_APP_API}/api/users/me`, {
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
    // ตรวจสอบ address
    if (!selectedAddress) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "กรุณาเลือกที่อยู่",
        life: 3000,
      });
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product?.id,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        width: item.width,
        length: item.length,
        thickness: item.thickness,
        installOption: item.installOption
      }));

      const payload = {
        addressId: selectedAddress.id,
        orderItems,
        totalAmount: grandTotal
      };

      const res = await fetch(`${process.env.REACT_APP_API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("ไม่สามารถสร้างออเดอร์ได้");
      }

      // ถ้าอยากเคลียร์ตะกร้าด้วย
      await fetch(`${process.env.REACT_APP_API}/api/cart/clear`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "สั่งซื้อสำเร็จ!",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/shop-order-info");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "เกิดข้อผิดพลาดในการสั่งซื้อ",
        life: 3000,
      });
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
      <Toast ref={toast} />
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
        <SummaryCard
          totalProductPrice={totalProductPrice}
          grandTotal={grandTotal}
          onConfirmOrder={handleOrderConfirmation}
        />
      </div>
    </div>
  );
}

export default ShopOrder;
