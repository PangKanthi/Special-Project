// File: src/Homeadmin.jsx
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { getBangkokTime } from "../utils/timeUtils";

// ----- Hook สำหรับยอดขาย (ที่เราแยกไฟล์) -----
import useSalesDataSeparate from "./Homeadmin component/useSalesDataSeparate";

// ----- Hook อื่น ๆ ของคุณ -----
import useCompletedOrders from "./Homeadmin component/useCompletedOrders";
import useFailedOrders from "./Homeadmin component/useFailedOrders";
import useCompletedRepairs from "./Homeadmin component/useCompletedRepairs";
import useFailedRepairs from "./Homeadmin component/useFailedRepairs";
import useUserCount from "./Homeadmin component/useUserCount";
import useInventoryData from "./Homeadmin component/useInventoryData";
import NotificationButton from "./Homeadmin component/NotificationButton";
import useUserSummaryData from "./Homeadmin component/useUserSummaryData";
import useRepairSalesData from "./Homeadmin component/useRepairSalesData";

const unitMap = {
  แผ่นประตูม้วน: "แผ่น",
  เสารางประตูม้วน: "เส้น",
  แกนเพลาประตูม้วน: "แท่ง",
  กล่องเก็บม้วนประตู: "กล่อง",
  ตัวล็อกประตูม้วน: "ตัว",
  กุญแจประตูม้วน: "ชุด",
  รอกโซ่ประตูม้วน: "ชุด",
  ชุดเฟืองโซ่ประตูม้วน: "ชุด",
  โซ่ประตูม้วน: "เมตร",
  ตัวล็อคโซ่สาว: "ตัว",
  ชุดมอเตอร์ประตูม้วน: "ชุด",
  สวิตช์กดควบคุม: "ชุด",
  อื่นๆ:"ชุด",
  manual_rolling_shutter: "ชุด",
  chain_electric_shutter: "ชุด",
  electric_rolling_shutter: "ชุด",
};

export default function Homeadmin() {
  // ============== Hook dashboard ด้านซ้าย ==============
  const completedOrders = useCompletedOrders();
  const failedOrders = useFailedOrders();
  const completedRepairs = useCompletedRepairs();
  const failedRepairs = useFailedRepairs();
  const { totalStock, productStock } = useInventoryData();
  const userCount = useUserCount();
  const [inventoryDialog, setInventoryDialog] = useState(false);

  // ============== เรียกใช้ Hook แยก ==============
  const {
    yearData,
    totalYearSales,
    monthData,
    totalMonthSales,
    loadYearData,
    loadMonthData,
  } = useSalesDataSeparate();

  const {
    yearData: repairYearData,
    monthData: repairMonthData,
    totalYearSales: totalRepairYear,
    totalMonthSales: totalRepairMonth,
    loadYearData: loadRepairYear,
    loadMonthData: loadRepairMonth,
  } = useRepairSalesData();

  // ============== State เกี่ยวกับกราฟ ==============
  const [chartMode, setChartMode] = useState("year"); // "year" | "month"
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedMonth, setSelectedMonth] = useState(null);
  const { summaryData, loadSummary, loading } = useUserSummaryData();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userChartMode, setUserChartMode] = useState("daily");
  const [selectedYear, setSelectedYear] = useState(getBangkokTime().getFullYear());
  const [chartCategory, setChartCategory] = useState("sales"); // "sales" หรือ "repairs"


  // ============== Dialog ตัวอย่าง: แสดงรายการรายเดือน ==============
  const [showMonthDialog, setShowMonthDialog] = useState(false);

  // เมื่อ mount ครั้งแรก -> โหลดยอดขายรายปี (เพื่อทำกราฟเป็นค่า default)
  useEffect(() => {
    loadYearData().then(() => {
      updateChartData("year");
    });
  }, []);

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    loadRepairYear();
  }, []);


  useEffect(() => {
    if (chartMode === "year") {
      loadYearData().then(() => {
        updateChartData("year");
      });
    } else if (chartMode === "month") {
      updateChartData("month");
    }
  }, [chartMode]);

  // เมื่อ monthData หรือ yearData เปลี่ยน -> อัปเดต chart
  useEffect(() => {
    updateChartData(chartMode);
  }, [yearData, monthData]);

  // ฟังก์ชันเปลี่ยน chartData ตามโหมด
  function updateChartData(mode) {
    if (mode === "year" && yearData.length) {
      const labels = yearData.map((item) => item.name);
      const dataset = yearData.map((item) => item.sales);

      setChartData({
        labels,
        datasets: [
          {
            label: "ยอดขายรวม (บาท)",
            data: dataset,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
          },
        ],
      });
    } else if (mode === "month" && monthData.length) {
      const labels = monthData.map((item) => item.name); // "คำสั่งซื้อ #1" ...
      const dataset = monthData.map((item) => item.total); // total บาท

      setChartData({
        labels,
        datasets: [
          {
            label: "ยอดขาย (บาท)",
            data: dataset,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 2,
          },
        ],
      });
    } else {
      // ยังไม่มีข้อมูล (เช่น ยังไม่ได้เลือกเดือน)
      setChartData({ labels: [], datasets: [] });
    }
  }

  // เมื่อเปลี่ยนเดือนใน Dropdown -> loadMonthData -> update chart
  function handleSelectMonth(e) {
    const mon = e.value;
    setSelectedMonth(mon);
    loadMonthData(mon).then(() => {
      updateChartData("month");
    });
  }

  const selectedUser = summaryData.find((u) => u.userId === selectedUserId);

  const rawChartData =
    userChartMode === "daily"
      ? selectedUser?.dailyChart
      : selectedUser?.monthlyChart;

  const chartUserData = rawChartData
    ? {
      labels: rawChartData.labels.filter((label) =>
        label.startsWith(String(selectedYear))
      ),
      datasets: rawChartData.datasets.map((ds) => ({
        ...ds,
        data: rawChartData.labels
          .map((label, idx) =>
            label.startsWith(String(selectedYear)) ? ds.data[idx] : null
          )
          .filter((v) => v !== null),
      })),
    }
    : null;

  const availableYears = rawChartData
    ? Array.from(new Set(rawChartData.labels.map((label) => label.substring(0, 4)))).sort()
    : [];

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl flex align-items-center">
          📊 Dashboard ผู้ดูแลระบบ
        </h2>
        <NotificationButton />
      </div>

      <Card style={{ backgroundColor: "#026DCA", borderRadius: "5px" }}>
        <div className="grid">
          <div className="col-12 md:col-5">
            <div className="grid">
              {[
                {
                  title: "คำสั่งซื้อสำเร็จ",
                  value: completedOrders.length,
                  color: "text-green-500",
                  unit: "รายการ",
                  icon: "✅",
                },
                {
                  title: "คำสั่งซื้อไม่สำเร็จ",
                  value: failedOrders.length,
                  color: "text-red-500",
                  unit: "รายการ",
                  icon: "❌",
                },
                {
                  title: "สินค้าคงคลัง",
                  value: totalStock,
                  color: "text-blue-500",
                  unit: "ชิ้น",
                  icon: "📦",
                  onClick: () => setInventoryDialog(true),
                },
                {
                  title: "ผู้ใช้งาน",
                  value: userCount,
                  color: "text-purple-500",
                  unit: "คน",
                  icon: "👤",
                },
                {
                  title: "คำขอซ่อมสำเร็จ",
                  value: completedRepairs,
                  color: "text-teal-500",
                  unit: "รายการ",
                  icon: "🛠️",
                },
                {
                  title: "คำขอซ่อมไม่สำเร็จ",
                  value: failedRepairs,
                  color: "text-orange-500",
                  unit: "รายการ",
                  icon: "⚠️",
                },
              ].map((item, idx) => (
                <div className="col-6 p-2" key={idx}>
                  <Card
                    className="shadow-3 p-1 text-center border-2 border-gray-300"
                    onClick={item.onClick}
                  >
                    <h4 className="text-gray-700 text-sm flex justify-center items-center">
                      {item.icon} {item.title}
                    </h4>
                    <h3 className={`font-bold text-md ${item.color} mt-2`}>
                      {item.value} {item.unit}
                    </h3>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* ======== ฝั่งขวา: Chart ที่สลับได้ (ปี/เดือน) ======== */}
          <div className="col-12 md:col-7">
            <Card title="ยอดขายสินค้า" className="shadow-3 p-2 relative">
              {/* Dropdown เลือกโหมด (year / month) */}
              <div className="mb-2 flex gap-2">
                <Dropdown
                  value={chartMode}
                  options={[
                    { label: "รายปี", value: "year" },
                    { label: "รายเดือน", value: "month" },
                  ]}
                  onChange={(e) => setChartMode(e.value)}
                  placeholder="เลือกโหมดกราฟ"
                  className="mr-2"
                />

                {chartMode === "month" && (
                  <Dropdown
                    value={selectedMonth}
                    options={[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ]}
                    onChange={handleSelectMonth}
                    placeholder="เลือกเดือน"
                  />
                )}
              </div>

              <div className="mt-2" style={{ minHeight: "400px" }}>
                <Chart
                  type="bar"
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                  }}
                  style={{ height: "400px" }}
                />
              </div>

              <div className="pt-3">
                {chartMode === "year" ? (
                  <span className="text-green-600 font-bold text-lg">
                    ยอดขายรวมทั้งปี: {totalYearSales.toLocaleString()} บาท
                  </span>
                ) : (
                  <span className="text-blue-600 font-bold text-lg">
                    ยอดขายรวมเดือน {selectedMonth ?? "-"}:{" "}
                    {totalMonthSales.toLocaleString()} บาท
                  </span>
                )}
              </div>

              {/* ตัวอย่างปุ่ม ถ้าจะเปิด Dialog รายเดือน */}
              {chartMode === "month" && (
                <div className="pt-2">
                  <Button
                    label="ดูรายละเอียดคำสั่งซื้อในเดือนนี้"
                    onClick={() => setShowMonthDialog(true)}
                    className="p-button-info"
                  />
                </div>
              )}

              <Dialog
                header="📦 รายการสินค้าคงคลัง"
                visible={inventoryDialog}
                style={{ width: "50vw" }}
                onHide={() => setInventoryDialog(false)}
              >
                <DataTable value={productStock} paginator rows={5}>
                  <Column field="id" header="รหัสสินค้า" />
                  <Column field="name" header="ชื่อสินค้า" />
                  <Column field="category" header="ประเภทสินค้า" />
                  <Column
                    field="stock"
                    header="จำนวนคงเหลือ"
                    body={(rowData) => (
                      <span
                        style={{
                          color:
                            rowData.stock === 0
                              ? "red"
                              : rowData.stock < 10
                                ? "orange"
                                : "black",
                          fontWeight: rowData.stock === 0 ? "bold" : "normal",
                        }}
                      >
                        {rowData.stock} {unitMap[rowData.category] || "ชิ้น"}
                      </span>
                    )}
                  />
                </DataTable>
              </Dialog>
            </Card>
          </div>
        </div>

        {/* ======== Dialog รายเดือน (ตัวอย่าง) ======== */}
        <Dialog
          header="รายละเอียดคำสั่งซื้อรายเดือน"
          visible={showMonthDialog}
          onHide={() => setShowMonthDialog(false)}
          style={{ width: "60vw" }}
        >
          <DataTable value={monthData} paginator rows={5}>
            <Column field="name" header="คำสั่งซื้อ" />
            <Column field="order_date" header="วันที่สั่งซื้อ" />
            <Column
              field="total"
              header="ยอดขายรวม (บาท)"
              body={(rowData) => rowData.total?.toLocaleString() || "0"}
            />
          </DataTable>
        </Dialog>
      </Card>
      <div className="pt-5">
        <Card style={{ backgroundColor: "#026DCA", borderRadius: "5px" }}>
          <div style={{ backgroundColor: "#fcfcfc", borderRadius: "5px" }} className="p-3">
            <h2 className="text-2xl">ค่าซ่อมสินค้า</h2>
            <div className="mb-2 flex gap-2">
              <Dropdown
                value={chartMode}
                options={[
                  { label: "รายปี", value: "year" },
                  { label: "รายเดือน", value: "month" },
                ]}
                onChange={(e) => setChartMode(e.value)}
              />
              {chartMode === "month" && (
                <Dropdown
                  value={selectedMonth}
                  options={[
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                  ]}
                  onChange={(e) => {
                    setSelectedMonth(e.value);
                    loadRepairMonth(e.value);
                  }}
                />
              )}
            </div>

            <Chart
              type="bar"
              data={{
                labels: chartMode === "year"
                  ? repairYearData.map((r) => r.name)
                  : repairMonthData.map((r) => r.name),
                datasets: [
                  {
                    label: "ค่าซ่อม (บาท)",
                    data: chartMode === "year"
                      ? repairYearData.map((r) => r.sales || r.total)
                      : repairMonthData.map((r) => r.total),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } },
              }}
              style={{ height: "400px" }}
            />

            <div className="pt-3">
              <span className="font-bold text-lg text-red-500">
                {chartMode === "year"
                  ? `ค่าซ่อมรวมทั้งปี: ${totalRepairYear.toLocaleString()} บาท`
                  : `ค่าซ่อมรวมเดือน ${selectedMonth ?? "-"}: ${totalRepairMonth.toLocaleString()} บาท`}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-5">
        <Card style={{ backgroundColor: "#026DCA", borderRadius: "5px" }}>
          <div style={{ backgroundColor: "#fcfcfc", borderRadius: "5px" }} className="p-3">
            <h2 className="text-2xl">สถิติตามผู้ใช้</h2>
            <div className="ml-3 mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Dropdown
                value={selectedUserId}
                options={summaryData.map((u) => ({
                  label: `${u.firstname} ${u.lastname}`,
                  value: u.userId,
                }))}
                onChange={(e) => setSelectedUserId(e.value)}
                placeholder="เลือกผู้ใช้"
                filter
              />

              <Dropdown
                value={userChartMode}
                options={[
                  { label: "กราฟรายวัน", value: "daily" },
                  { label: "กราฟรายเดือน", value: "monthly" }
                ]}
                onChange={(e) => setUserChartMode(e.value)}
                placeholder="เลือกโหมดกราฟ"
              />

              <Dropdown
                value={selectedYear}
                options={availableYears.map((y) => ({ label: `ปี ${y}`, value: Number(y) }))}
                onChange={(e) => setSelectedYear(e.value)}
                placeholder="เลือกปี"
              />
            </div>

            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : chartUserData ? (
              <Chart
                type="bar"
                data={chartUserData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: true } },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: userChartMode === "daily" ? "วันที่" : "เดือน",
                      },
                      ticks: { maxRotation: 45, minRotation: 0 },
                    },
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "จำนวนรายการ" },
                    },
                  },
                }}
                style={{ height: "400px" }}
              />
            ) : selectedUserId ? (
              <p className="text-gray-500">ไม่พบข้อมูลของผู้ใช้นี้</p>
            ) : (
              <p className="text-gray-500">กรุณาเลือกผู้ใช้</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}