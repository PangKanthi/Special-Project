import { useState } from "react";
import axios from "axios";

export default function useRepairSalesData() {
  const [yearData, setYearData] = useState([]);
  const [totalYearSales, setTotalYearSales] = useState(0);

  const [monthData, setMonthData] = useState([]);
  const [totalMonthSales, setTotalMonthSales] = useState(0);

  const monthOrder = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  async function loadYearData(selectedYear = new Date().getFullYear()) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/repair-requests/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const completed = res.data.data.filter((r) => {
        if (r.status !== "complete") return false;
        const dt = new Date(r.request_date);
        return dt.toString() !== "Invalid Date" && dt.getFullYear() === selectedYear;
      });

      const salesByMonth = {};
      let yearSum = 0;

      completed.forEach((r) => {
        const dt    = new Date(r.request_date);
        const month = dt.toLocaleString("en-US", { month: "short" });
        const price = parseFloat(r.repair_price) || 0;
        salesByMonth[month] = (salesByMonth[month] || 0) + price;
        yearSum += price;
      });

      setTotalYearSales(yearSum);
      setYearData(monthOrder.map((m) => ({ name: m, sales: salesByMonth[m] || 0 })));
    } catch (err) {
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
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/repair-requests/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const completed = res.data.data.filter((r) => {
        if (r.status !== "complete") return false;
        const dt = new Date(r.request_date);
        return dt.toString() !== "Invalid Date" && dt.getFullYear() === selectedYear;
      });

      const filtered = completed.filter((r) => {
        const month = new Date(r.request_date).toLocaleString("en-US", { month: "short" });
        return month === selectedMonth;
      });

      let monthSum = 0;
      const mapped = filtered.map((r) => {
        const price = parseFloat(r.repair_price) || 0;
        monthSum += price;
        return {
          name: `ซ่อม #${r.id}`,
          request_date: new Date(r.request_date).toLocaleDateString("th-TH"),
          total: price,
        };
      });

      setMonthData(mapped);
      setTotalMonthSales(monthSum);
    } catch (err) {
      console.error(" loadRepairMonthData failed:", err);
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
