import { useState, useEffect } from "react";
import axios from "axios";

const useSalesData = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:1234/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ กรองเฉพาะออเดอร์ที่มี status เป็น "complete"
            const completedOrders = response.data.data.filter(order => order.status === "complete");

            // ✅ สร้างโครงสร้างสำหรับจัดเก็บยอดขายแต่ละเดือน
            const salesByMonth = {};

            completedOrders.forEach(order => {
                const month = new Date(order.order_date).toLocaleString("en-US", { month: "short" });

                // ✅ ตรวจสอบและแปลงยอดขายให้แน่ใจว่าเป็นตัวเลข
                const amount = parseFloat(order.total_amount);
                if (!isNaN(amount)) {
                    salesByMonth[month] = (salesByMonth[month] || 0) + amount;
                }
            });

            // ✅ แปลงเป็น array สำหรับ Chart และเรียงเดือนให้ถูกต้อง
            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const chartData = monthOrder.map(month => ({
                name: month,
                sales: salesByMonth[month] || 0,
            }));

            setSalesData(chartData);
        } catch (error) {
            console.error("❌ Error fetching sales data:", error);
        }
    };

    return salesData;
};

export default useSalesData;
