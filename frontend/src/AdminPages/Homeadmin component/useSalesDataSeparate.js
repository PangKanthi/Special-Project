import { useState } from "react";
import axios from "axios";

export default function useSalesDataSeparate() {
  const [yearData, setYearData] = useState([]);
  const [totalYearSales, setTotalYearSales] = useState(0);
  const [monthData, setMonthData] = useState([]);
  const [totalMonthSales, setTotalMonthSales] = useState(0);

  const monthOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  async function loadYearData(selectedYear = new Date().getFullYear()) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const completed = res.data.data.filter((o) => {
        if (o.status !== "complete") return false;
        const dt = new Date(o.order_date);
        return dt.toString() !== "Invalid Date" && dt.getFullYear() === selectedYear;
      });

      const salesByMonth = {};
      let yearlyTotal = 0;

      completed.forEach((o) => {
        const dt = new Date(o.order_date);
        const m = dt.toLocaleString("en-US", { month: "short" });
        const amt = parseFloat(o.total_amount) || 0;
        salesByMonth[m] = (salesByMonth[m] || 0) + amt;
        yearlyTotal += amt;
      });

      setTotalYearSales(yearlyTotal);
      setYearData(
        monthOrder.map((m) => ({ name: m, sales: salesByMonth[m] || 0 }))
      );
    } catch (err) {
      console.error(" loadYearData failed:", err);
      setYearData([]);
      setTotalYearSales(0);
    }
  }

  async function loadMonthData(
    selectedMonth,
    selectedYear = new Date().getFullYear()
  ) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const completed = res.data.data.filter((o) => {
        if (o.status !== "complete") return false;
        const dt = new Date(o.order_date);
        return dt.toString() !== "Invalid Date" && dt.getFullYear() === selectedYear;
      });

      const filtered = completed.filter((o) => {
        const m = new Date(o.order_date).toLocaleString("en-US", { month: "short" });
        return m === selectedMonth;
      });

      let monthSum = 0;
      const mapped = filtered.map((o) => {
        const amt = parseFloat(o.total_amount) || 0;
        monthSum += amt;
        return {
          id: o.id,
          name: `คำสั่งซื้อ #${o.id}`,
          order_date: new Date(o.order_date).toLocaleDateString("th-TH"),
          total: amt,
        };
      });

      setMonthData(mapped);
      setTotalMonthSales(monthSum);
    } catch (err) {
      console.error("loadMonthData failed:", err);
      setMonthData([]);
      setTotalMonthSales(0);
    }
  }

  return {
    yearData,
    totalYearSales,
    monthData,
    totalMonthSales,
    loadYearData,
    loadMonthData,
  };
}
