import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopOrderHeader from "./ShopOrder Component/ShopOrderHeader";
import CartItem from "./ShopOrder Component/CartItem";
import SummaryCard from "./ShopOrder Component/SummaryCard";
import SlipPayment from "./ShopOrder Component/SlipPayment";

function ShopOrder() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ images: [] });
  const [uploadedSlipUrl, setUploadedSlipUrl] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [orderId, setOrderId] = useState("999");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("http://localhost:1234/api/addresses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAddresses(data.data || []);
        } else {
          console.error("ไม่สามารถดึงข้อมูลที่อยู่ได้:", data.message);
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงที่อยู่:", err);
      }
    };

    fetchAddresses();
  }, []);

  if (!cart || cart.length === 0) {
    return <p>ไม่มีสินค้าในตะกร้า</p>;
  }

  const handleUploadSlip = async () => {
    if (!form.images.length) {
      alert("กรุณาอัปโหลดสลิปก่อน");
      return;
    }
    const formData = new FormData();
    formData.append("slip", form.images[0].file);
  
    try {
      const response = await fetch(`http://localhost:1234/api/orders/${orderId}/upload-slip`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || "เกิดข้อผิดพลาดในการอัปโหลดสลิป");
        setLoading(false);
        return;
      }
      setUploadedSlipUrl(result.imageUrl);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดสลิป");
    }
  };
  

  const handleCheckSlip = async () => {
    if (!form.images.length) {
      alert("กรุณาอัปโหลดสลิปก่อนตรวจสอบ");
      return;
    }
    const formData = new FormData();
    formData.append("slip", form.images[0].file);
    formData.append("amount", grandTotal);

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:1234/api/check-slip", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || "เกิดข้อผิดพลาดในการตรวจสอบสลิป");
        setLoading(false);
        return;
      }
      setOrderStatus("PAID");
      setLoading(false);
    } catch (error) {
      console.error("❌ Error:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setLoading(false);
    }
  };

  const handleOrderConfirmation = async () => {
    if (!form.images.length) {
      alert("กรุณาอัปโหลดสลิปก่อนทำการสั่งซื้อ");
      return;
    }
    const formData = new FormData();
    formData.append("slip", form.images[0].file);
    formData.append("amount", grandTotal);
    formData.append("orderId", orderId);

    setLoading(true);
    setErrorMessage("");

    try {
      const uploadResponse = await fetch(
        "http://localhost:1234/api/upload-slip",
        {
          method: "POST",
          body: formData,
        }
      );
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setErrorMessage(
          uploadResult.error || "เกิดข้อผิดพลาดในการอัปโหลดสลิป"
        );
        setLoading(false);
        return;
      }
      setUploadedSlipUrl(uploadResult.imageUrl);

      const orderData = {
        cart,
        slipUrl: uploadResult.imageUrl,
        orderId: orderId,
      };
      const orderResponse = await fetch("http://localhost:1234/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (orderResponse.ok) {
        const orderResult = await orderResponse.json();
        alert(`สั่งซื้อสำเร็จ! สถานะคำสั่งซื้อ: ${orderResult.orderStatus}`);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/shop-order-info", { state: { orderDetails: orderResult } });
      } else {
        alert("เกิดข้อผิดพลาดในการสั่งซื้อ");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  const totalProductPrice = cart.reduce((sum, item) => {
    const price =
      typeof item.product.price === "number"
        ? item.product.price
        : parseInt(item.product.price.replace(/,| บาท/g, ""), 10);
    return sum + price * item.quantity;
  }, 0);

  const totalInstallationFee = cart.reduce(
    (sum, item) => sum + (item.installation === "ติดตั้ง" ? 150 : 0),
    0
  );

  const grandTotal = totalProductPrice + totalInstallationFee;
  const selectedAddress = addresses[selectedAddressIndex] || null;

  return (
    <div className="lg:flex justify-content-center pt-6">
      <div className="px-4 sm:px-6 md:px-8 lg:mr-8">
        <ShopOrderHeader
          addresses={addresses}
          selectedAddressIndex={selectedAddressIndex}
          setSelectedAddressIndex={setSelectedAddressIndex}
          address={selectedAddress}
        />

        {cart.map((item, index) => (
          <CartItem key={index} item={item} />
        ))}
      </div>

      <div className="pl-5 pr-5 lg:pt-7">
        <div className="w-full lg:w-auto justify-content-center flex">
          <SummaryCard
            totalProductPrice={totalProductPrice}
            totalInstallationFee={totalInstallationFee}
            grandTotal={grandTotal}
          />
        </div>

        <div className="pt-4 ">
          <div>
            <strong>วิธีการชำระเงิน</strong>
          </div>

          <div className="w-full lg:w-auto flex justify-end pt-3">
            <SlipPayment
              form={form}
              setForm={setForm}
              loading={loading}
              errorMessage={errorMessage}
              orderStatus={orderStatus}
              handleCheckSlip={handleCheckSlip}
              grandTotal={grandTotal}
              handleOrderConfirmation={handleOrderConfirmation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopOrder;
