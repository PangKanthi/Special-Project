import { useState, useEffect } from "react";
import axios from "axios";

const useSalesData = (selectedMonth, viewMode) => {
    const [salesData, setSalesData] = useState([]);
    const [totalYearlySales, setTotalYearlySales] = useState(0);
    const [totalMonthlySales, setTotalMonthlySales] = useState(0);

    useEffect(() => {
        fetchSalesData();
    }, [selectedMonth, viewMode]);

    const fetchSalesData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:1234/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const completedOrders = response.data.data.filter(order => order.status === "complete");
            console.log("[DEBUG] completedOrders =>", completedOrders);

            if (viewMode === "year") {
                // ✅ คำนวณยอดขายรวมของทั้งปี
                const salesByMonth = {};
                let yearlyTotal = 0;

                completedOrders.forEach(order => {
                    const orderDate = new Date(order.order_date);
                    const month = orderDate.toLocaleString("en-US", { month: "short" });
                    const amount = parseFloat(order.total_amount);
                    if (!isNaN(amount)) {
                        salesByMonth[month] = (salesByMonth[month] || 0) + amount;
                        yearlyTotal += amount;
                    }
                });

                setTotalYearlySales(yearlyTotal);
                const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                setSalesData(monthOrder.map(month => ({
                    name: month,
                    sales: salesByMonth[month] || 0
                })));

            } else if (viewMode === "month" && selectedMonth) {
                // ✅ คำนวณยอดขายรวมของเดือนที่เลือก
                const filteredOrders = completedOrders.filter(order => {
                    const orderMonth = new Date(order.order_date).toLocaleString("en-US", { month: "short" });
                    return orderMonth === selectedMonth;
                });

                let monthlyTotal = filteredOrders.reduce((acc, order) => acc + parseFloat(order.total_amount), 0);

                const salesSummary = filteredOrders.map(order => ({
                    id: order.id,
                    name: `คำสั่งซื้อ #${order.id}`,
                    order_date: new Date(order.order_date).toLocaleDateString("th-TH"),
                    total: order.total_amount ? parseFloat(order.total_amount) : 0
                }));

                setTotalMonthlySales(monthlyTotal); // ✅ ใช้ค่าที่รวมกันแล้ว
                setSalesData(salesSummary);

            }
        } catch (error) {
            console.error("❌ Error fetching sales data:", error);
        }
    };

    return { salesData, totalYearlySales, totalMonthlySales };
};

export default useSalesData;
