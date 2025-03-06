import React, { useState } from "react";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, author: "", comment: "" });

    const handleAddReview = () => {
        if (newReview.author && newReview.comment) {
            setReviews([...reviews, { ...newReview, date: new Date().toLocaleDateString() }]);
            setNewReview({ rating: 0, author: "", comment: "" });
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold mb-3">คะแนนรีวิวสินค้า</h3>
            <div className="mb-4">
                <InputText
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    placeholder="ชื่อของคุณ"
                    className="p-inputtext w-full mb-2"
                />
                <InputText
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="แสดงความคิดเห็น"
                    className="p-inputtext w-full mb-2"
                />
                <Rating
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.value })}
                    cancel={false}
                    className="mb-2 pt-1"
                />
                <Button label="เพิ่มรีวิว" onClick={handleAddReview} className="p-button-primary" />
                <Divider className="my-4 w-16 border-blue-500 mx-auto" />
            </div>
            {reviews.map((review, index) => (
                <div key={index} className="pt-2 border-b pb-2">
                    <div className="flex items-center gap-2">
                        <Rating value={review.rating} readOnly cancel={false} />
                        <span className="text-sm text-gray-600">{review.author} - {review.date}</span>
                    </div>
                    <p className="mt-2 text-gray-800">{review.comment}</p>
                    <Divider className="my-4 w-16 border-blue-500 mx-auto" />
                </div>
            ))}
        </div>
    );
};

export default CustomerReviews;
