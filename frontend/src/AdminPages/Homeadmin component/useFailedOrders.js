import { useState, useEffect } from "react";
import axios from "axios";

const useFailedOrders = (selectedMonth) => {
    const [failedOrders, setFailedOrders] = useState(0);

    useEffect(() => {
        fetchFailedOrders();
    }, [selectedMonth]); // ✅ ดึงข้อมูลใหม่เมื่อเลือกเดือน

    const fetchFailedOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:1234/api/orders?month=${selectedMonth}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ กรองเฉพาะคำสั่งซื้อที่มีสถานะเป็น "cancle"
            const failed = response.data.data.filter(order => order.status === "cancle").length;
            setFailedOrders(failed);
        } catch (error) {
            console.error("❌ Error fetching failed orders:", error);
        }
    };

    return failedOrders;
};

export default useFailedOrders;
