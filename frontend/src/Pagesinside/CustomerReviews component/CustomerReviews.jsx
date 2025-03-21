// CustomerReviews.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const CustomerReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [errorMessage, setErrorMessage] = useState("");
  
  // ▼▼ เพิ่ม 2 state สำหรับเช็ค login และ purchased ▼▼
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // ตรวจสอบ token เพื่อบอกว่า login ไหม
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // โหลดรีวิวจาก backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/api/reviews/product/${productId}`
        );
        setReviews(resp.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  // เรียกเช็คว่า user เคยซื้อสินค้านี้ไหม
  useEffect(() => {
    if (!isLoggedIn) return; // ยังไม่ล็อกอิน ไม่ต้องเช็ค

    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_API}/api/orders/checkPurchased/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((resp) => {
        // resp.data = { hasPurchased: true/false }
        setHasPurchased(resp.data.hasPurchased);
      })
      .catch((err) => {
        console.error("Error checking purchase:", err);
      });
  }, [isLoggedIn, productId]);

  // เพิ่มรีวิว (เรียก POST -> /api/reviews)
  const handleAddReview = async () => {
    try {
      setErrorMessage("");
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("กรุณาล็อกอินก่อนรีวิว");
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API}/api/reviews`,
        {
          productId,
          content: newReview.comment,
          rating: newReview.rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // หลังเพิ่มรีวิวสำเร็จ รีโหลดรีวิวใหม่
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/api/reviews/product/${productId}`
      );
      setReviews(resp.data.data);

      // เคลียร์ฟอร์ม
      setNewReview({ rating: 0, comment: "" });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-3">คะแนนรีวิวสินค้า</h3>

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {errorMessage}
        </div>
      )}

      {/* 
        ฟอร์มรีวิวจะแสดงต่อเมื่อ:
          1) ล็อกอินแล้ว (isLoggedIn === true)
          2) hasPurchased === true
      */}
      {isLoggedIn && hasPurchased ? (
        <div className="mb-4">
          <InputText
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="เขียนความคิดเห็น"
            className="p-inputtext w-full mb-2"
          />
          <Rating
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.value })}
            cancel={false}
            className="mb-2 pt-1"
          />
          <Button
            label="เพิ่มรีวิว"
            onClick={handleAddReview}
            className="p-button-primary"
          />
          <Divider className="my-4 w-16 border-blue-500 mx-auto" />
        </div>
      ) : (
        // กรณีไม่เคยซื้อ หรือไม่ได้ล็อกอิน -> อาจจะโชว์ข้อความ หรือปล่อยว่างก็ได้
        <p style={{ color: "gray" }}>
          
        </p>
      )}

      {/* แสดงรายการรีวิว */}
      {reviews?.map((r, index) => (
        <div key={index} className="pt-2 border-b pb-2">
          <div className="flex items-center gap-2">
            <Rating value={r.rating} readOnly cancel={false} />
            <span className="text-sm text-gray-600">
              {r.user ? r.user.firstname : "ไม่ทราบชื่อ"}
            </span>
          </div>
          <p className="mt-2 text-gray-800">{r.content}</p>
          <Divider className="my-4 w-16 border-blue-500 mx-auto" />
        </div>
      ))}
    </div>
  );
};

export default CustomerReviews;
