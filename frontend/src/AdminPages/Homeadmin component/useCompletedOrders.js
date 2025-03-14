import { useState, useEffect } from "react";
import axios from "axios";

const useCompletedOrders = () => {
    const [completedOrders, setCompletedOrders] = useState(0);

    useEffect(() => {
        fetchCompletedOrders();
    }, []);

    const fetchCompletedOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:1234/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ กรองเฉพาะคำสั่งซื้อที่มี status เป็น "complete"
            const completed = response.data.data.filter(order => order.status === "complete").length;
            setCompletedOrders(completed);
        } catch (error) {
            console.error("❌ Error fetching completed orders:", error);
        }
    };

    return completedOrders;
};

export default useCompletedOrders;
