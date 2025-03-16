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
            const response = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const completedOrders = response.data.data.filter(order => order.status === "complete");

            const salesByMonth = {}; // ออบเจ็กต์เก็บยอดขายรายเดือน

            // ✅ เติมค่าเริ่มต้นเป็น 0 ทุกเดือน
            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            monthOrder.forEach(month => salesByMonth[month] = 0);

            completedOrders.forEach(order => {
                const month = new Date(order.order_date).toLocaleString("en-US", { month: "short" });
                const amount = parseFloat(order.total_amount);
                salesByMonth[month] += isNaN(amount) ? 0 : amount;
            });

            // ✅ แปลงข้อมูลเป็น array สำหรับกราฟ
            const chartData = monthOrder.map(month => ({
                name: month,
                sales: salesByMonth[month],
            }));

            setSalesData(chartData);
        } catch (error) {
            console.error("❌ Error fetching sales data:", error);
        }
    };


    return salesData;
};

export default useSalesData;
