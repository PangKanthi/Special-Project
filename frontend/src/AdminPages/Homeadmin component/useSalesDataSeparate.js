import { useState, useEffect } from "react";
import axios from "axios";

export default function useSalesDataSeparate() {
  // เก็บข้อมูลยอดขายรายปี
  const [yearData, setYearData] = useState([]);
  const [totalYearSales, setTotalYearSales] = useState(0);

  // เก็บข้อมูลยอดขายรายเดือน
  const [monthData, setMonthData] = useState([]);
  const [totalMonthSales, setTotalMonthSales] = useState(0);

  // ตัวอย่าง: loadYearData() -> ดึงข้อมูลปี
  async function loadYearData() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    });

      const completedOrders = response.data.data.filter(o => o.status === "complete");
      const salesByMonth = {};
      let yearlyTotal = 0;
      const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      completedOrders.forEach(order => {
        const dt = new Date(order.order_date);
        if (dt.toString() !== "Invalid Date") {
          const shortMonth = dt.toLocaleString("en-US", { month: "short" });
          const amount = parseFloat(order.total_amount) || 0;
          salesByMonth[shortMonth] = (salesByMonth[shortMonth] || 0) + amount;
          yearlyTotal += amount;
        }
      });

      setTotalYearSales(yearlyTotal);

      const mappedYearData = monthOrder.map(m => ({
        name: m,
        sales: salesByMonth[m] || 0
      }));
      setYearData(mappedYearData);

    } catch (error) {
      console.error("❌ loadYearData failed:", error);
      setYearData([]);
      setTotalYearSales(0);
    }
  }

  // ตัวอย่าง: loadMonthData(month) -> ดึงข้อมูลเดือน
  async function loadMonthData(selectedMonth) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const completedOrders = response.data.data.filter(o => o.status === "complete");

      const filtered = completedOrders.filter(order => {
        const dt = new Date(order.order_date);
        if (dt.toString() === "Invalid Date") return false;
        const shortMonth = dt.toLocaleString("en-US", { month: "short" });
        return shortMonth === selectedMonth;
      });

      let sum = 0;
      const mappedMonthData = filtered.map(o => {
        const amount = parseFloat(o.total_amount) || 0;
        sum += amount;
        return {
          id: o.id,
          name: `คำสั่งซื้อ #${o.id}`,
          order_date: new Date(o.order_date).toLocaleDateString("th-TH"),
          total: amount
        };
      });

      setMonthData(mappedMonthData);
      setTotalMonthSales(sum);

    } catch (error) {
      console.error("❌ loadMonthData failed:", error);
      setMonthData([]);
      setTotalMonthSales(0);
    }
  }

  // รีเทิร์นฟังก์ชัน + สเตตที่จำเป็น
  return {
    yearData,
    totalYearSales,
    monthData,
    totalMonthSales,
    loadYearData,
    loadMonthData
  };
}
