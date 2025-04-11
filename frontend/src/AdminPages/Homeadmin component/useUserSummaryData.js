import { useState } from "react";
import axios from "axios";

const useUserSummaryData = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const [orderRes, repairRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API}/api/repair-requests/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const orders = orderRes.data.data || [];
      const repairs = repairRes.data.data || [];

      const userMap = {};

      // รวมข้อมูล Order
      orders.forEach((order) => {
        const userId = order.user?.id;
        if (!userId) return;

        const date = new Date(order.order_date);
        const dayKey = date.toISOString().slice(0, 10);
        const monthKey = date.toISOString().slice(0, 7);

        if (!userMap[userId]) {
          userMap[userId] = {
            firstname: order.user.firstname,
            lastname: order.user.lastname,
            daily: {},
            monthly: {}
          };
        }

        if (!userMap[userId].daily[dayKey]) userMap[userId].daily[dayKey] = initCount();
        if (!userMap[userId].monthly[monthKey]) userMap[userId].monthly[monthKey] = initCount();

        if (order.status === "complete") {
          userMap[userId].daily[dayKey].completedOrders++;
          userMap[userId].monthly[monthKey].completedOrders++;
        } else if (order.status === "cancle") {
          userMap[userId].daily[dayKey].failedOrders++;
          userMap[userId].monthly[monthKey].failedOrders++;
        }
      });

      // รวมข้อมูล Repair
      repairs.forEach((repair) => {
        const userId = repair.user?.id;
        if (!userId) return;

        const date = new Date(repair.request_date);
        const dayKey = date.toISOString().slice(0, 10);      // YYYY-MM-DD
        const monthKey = date.toISOString().slice(0, 7);     // YYYY-MM

        if (!userMap[userId]) {
          userMap[userId] = {
            firstname: repair.user.firstname,
            lastname: repair.user.lastname,
            daily: {},
            monthly: {}
          };
        }

        if (!userMap[userId].daily[dayKey]) userMap[userId].daily[dayKey] = initCount();
        if (!userMap[userId].monthly[monthKey]) userMap[userId].monthly[monthKey] = initCount();

        if (repair.status === "complete") {
          userMap[userId].daily[dayKey].completedRepairs++;
          userMap[userId].monthly[monthKey].completedRepairs++;
        } else if (repair.status === "cancle") {
          userMap[userId].daily[dayKey].failedRepairs++;
          userMap[userId].monthly[monthKey].failedRepairs++;
        }
      });

      // สร้าง chart สำหรับแต่ละ user
      const summary = Object.entries(userMap).map(([userId, user]) => {
        const dailyLabels = Object.keys(user.daily).sort();
        const monthlyLabels = Object.keys(user.monthly).sort();

        return {
          userId: Number(userId),
          firstname: user.firstname,
          lastname: user.lastname,
          dailyChart: createChart(user.daily, dailyLabels),
          monthlyChart: createChart(user.monthly, monthlyLabels)
        };
      });

      setSummaryData(summary);
    } catch (error) {
      console.error("❌ Error loading summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return { summaryData, loadSummary, loading };
};

// สร้างข้อมูล chart จาก history ที่รวมแล้ว
function createChart(history, labels) {
  return {
    labels,
    datasets: [
      {
        label: "คำสั่งซื้อสำเร็จ",
        data: labels.map((d) => history[d].completedOrders),
        borderColor: "#4caf50",
        backgroundColor: "#4caf50",
        fill: false,
        tension: 0.4,
      },
      {
        label: "คำสั่งซื้อไม่สำเร็จ",
        data: labels.map((d) => history[d].failedOrders),
        borderColor: "#f44336",
        backgroundColor: "#f44336",
        fill: false,
        tension: 0.4,
      },
      {
        label: "คำขอซ่อมสำเร็จ",
        data: labels.map((d) => history[d].completedRepairs),
        borderColor: "#2196f3",
        backgroundColor: "#2196f3",
        fill: false,
        tension: 0.4,
      },
      {
        label: "คำขอซ่อมไม่สำเร็จ",
        data: labels.map((d) => history[d].failedRepairs),
        borderColor: "#ff9800",
        backgroundColor: "#ff9800",
        fill: false,
        tension: 0.4,
      },
    ]
  };
}

function initCount() {
  return {
    completedOrders: 0,
    failedOrders: 0,
    completedRepairs: 0,
    failedRepairs: 0,
  };
}

export default useUserSummaryData;