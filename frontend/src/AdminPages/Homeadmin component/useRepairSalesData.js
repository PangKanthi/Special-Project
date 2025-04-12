import { useState } from "react";
import axios from "axios";

export default function useRepairSalesData() {
  const [yearData, setYearData] = useState([]);
  const [totalYearSales, setTotalYearSales] = useState(0);

  const [monthData, setMonthData] = useState([]);
  const [totalMonthSales, setTotalMonthSales] = useState(0);

  const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  async function loadYearData() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API}/api/repair-requests/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const completedRepairs = res.data.data.filter(r => r.status === "complete");
      const salesByMonth = {};
      let yearlyTotal = 0;

      completedRepairs.forEach(r => {
        const dt = new Date(r.request_date);
        const shortMonth = dt.toLocaleString("en-US", { month: "short" });
        const price = parseFloat(r.repair_price) || 0;
        salesByMonth[shortMonth] = (salesByMonth[shortMonth] || 0) + price;
        yearlyTotal += price;
      });

      const mapped = monthOrder.map(m => ({
        name: m,
        sales: salesByMonth[m] || 0
      }));

      setYearData(mapped);
      setTotalYearSales(yearlyTotal);
    } catch (err) {
      console.error("\u274C loadRepairYearData failed:", err);
      setYearData([]);
      setTotalYearSales(0);
    }
  }

  async function loadMonthData(monthStr) {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API}/api/repair-requests/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const completedRepairs = res.data.data.filter(r => r.status === "complete");
      const filtered = completedRepairs.filter(r => {
        const dt = new Date(r.request_date);
        const shortMonth = dt.toLocaleString("en-US", { month: "short" });
        return shortMonth === monthStr;
      });

      let total = 0;
      const mapped = filtered.map(r => {
        const price = parseFloat(r.repair_price) || 0;
        total += price;
        return {
          name: `ซ่อม #${r.id}`,
          total: price,
          request_date: new Date(r.request_date).toLocaleDateString("th-TH"),
        };
      });

      setMonthData(mapped);
      setTotalMonthSales(total);
    } catch (err) {
      console.error("\u274C loadRepairMonthData failed:", err);
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
    loadMonthData
  };
}