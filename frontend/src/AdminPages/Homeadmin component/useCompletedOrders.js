import { useState, useEffect } from "react";
import axios from "axios";

const useCompletedOrders = (selectedMonth) => {
    const [completedOrders, setCompletedOrders] = useState([]);
    
    useEffect(() => {
        fetchCompletedOrders();
    }, [selectedMonth]); // ✅ ดึงข้อมูลใหม่เมื่อเลือกเดือน

    const fetchCompletedOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.react_app_api}/orders?month=${selectedMonth}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ กรองเฉพาะคำสั่งซื้อที่มีสถานะเป็น "complete"
            const completed = response.data.data.filter(order => order.status === "complete");
            setCompletedOrders(completed);
        } catch (error) {
            console.error("❌ Error fetching completed orders:", error);
        }
    };

    return completedOrders;
};

export default useCompletedOrders;
