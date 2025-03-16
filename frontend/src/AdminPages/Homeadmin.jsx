import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useCompletedOrders from "./Homeadmin component/useCompletedOrders";
import useFailedOrders from "./Homeadmin component/useFailedOrders";
import useCompletedRepairs from "./Homeadmin component/useCompletedRepairs";
import useFailedRepairs from "./Homeadmin component/useFailedRepairs";
import useUserCount from "./Homeadmin component/useUserCount";
import useInventoryData from "./Homeadmin component/useInventoryData";
import useSalesData from "./Homeadmin component/useSalesData";

const Homeadmin = () => {
    const [selectedMonth, setSelectedMonth] = useState("Jan");
    const completedOrders = useCompletedOrders(selectedMonth);
    const failedOrders = useFailedOrders(selectedMonth);
    const completedRepairs = useCompletedRepairs(selectedMonth);
    const failedRepairs = useFailedRepairs(selectedMonth);
    const { totalStock, productStock } = useInventoryData();
    const [inventoryDialog, setInventoryDialog] = useState(false);
    const salesDataFromAPI = useSalesData(selectedMonth);
    const userCount = useUserCount();

    // ✅ สร้าง State สำหรับเปิด / ปิด Modal
    const [showCompletedDialog, setShowCompletedDialog] = useState(false);
    const [showFailedDialog, setShowFailedDialog] = useState(false);

    // ✅ แปลงข้อมูลจาก API ให้เข้ากับโครงสร้าง Chart.js
    const salesChartData = {
        labels: salesDataFromAPI.map(item => item.name),
        datasets: [
            {
                label: "ยอดขาย (บาท)",
                data: salesDataFromAPI.map(item => item.sales),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2
            }
        ]
    };

    return (
        <div className="p-5">
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="text-2xl flex align-items-center">
                    📊 Dashboard ผู้ดูแลระบบ
                </h2>
            </div>
            <Card style={{ backgroundColor: '#026DCA', borderRadius: '5px' }}>
                <div className="grid">
                    <div className="col-12 md:col-5">
                        <div className="grid">
                            {[
                                { title: "คำสั่งซื้อสำเร็จ", value: completedOrders.length, color: "text-green-500", unit: "รายการ", icon: "✅", onClick: () => setShowCompletedDialog(true) },
                                { title: "คำสั่งซื้อไม่สำเร็จ", value: failedOrders.length, color: "text-red-500", unit: "รายการ", icon: "❌", onClick: () => setShowFailedDialog(true) },
                                { title: "สินค้าคงคลัง", value: totalStock, color: "text-blue-500", unit: "ชิ้น", icon: "📦", onClick: () => setInventoryDialog(true) },
                                { title: "ผู้ใช้งาน", value: userCount, color: "text-purple-500", unit: "คน", icon: "👤" },
                                { title: "คำขอซ่อมสำเร็จ", value: completedRepairs, color: "text-teal-500", unit: "รายการ", icon: "🛠️" },
                                { title: "คำขอซ่อมไม่สำเร็จ", value: failedRepairs, color: "text-orange-500", unit: "รายการ", icon: "⚠️" }
                            ].map((item, index) => (
                                <div className="col-6 p-2" key={index}>
                                    <Card
                                        className="shadow-3 p-1 text-center hover:shadow-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer border-2 border-gray-300"
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

                    {/* ฝั่งขวา - กราฟยอดขาย (ลดขนาดลงให้สมดุล) */}
                    <div className="col-12 md:col-7">
                        <Card title="ยอดขายรายเดือน" className="shadow-3 p-2 relative">
                            {/* ✅ ปรับ `Chart` ให้อยู่ใต้ปุ่ม */}
                            <div className="mt-10">
                                <Chart type="bar" data={salesChartData} options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 100
                                            }
                                        }
                                    }
                                }} style={{ height: "440px" }} />
                            </div>
                            <div className="absolute top-3 right-4 z-10 pt-1">
                                <Button
                                    className="bg-blue-500 text-white px-3 py-1 rounded shadow-md hover:bg-blue-600 transition"
                                    
                                >
                                    ดูสรุปยอดขาย
                                </Button>
                            </div>
                        </Card>
                    </div>

                </div>
                {/* ✅ Modal แสดงสรุปยอดขายรายเดือน */}
                <Dialog
                    header={`📊 สรุปยอดขายประจำเดือน`}
                    style={{ width: '50vw' }}
                    
                >
                    <div className="p-3">
                        <h3 className="text-xl font-bold text-gray-700">
                            ยอดขายรวม: <span className="text-green-500">฿</span>
                        </h3>
                        <DataTable paginator rows={5} className="mt-3">
                            <Column field="name" header="ชื่อสินค้า"></Column>
                            <Column field="quantity" header="จำนวน"></Column>
                            <Column field="total" header="รวม (บาท)"></Column>
                        </DataTable>
                    </div>
                </Dialog>


                {/* ✅ Modal แสดงรายละเอียดสินค้าคงคลัง */}
                <Dialog header="📦 รายการสินค้าคงคลัง" visible={inventoryDialog} style={{ width: '50vw' }} onHide={() => setInventoryDialog(false)}>
                    <DataTable value={productStock} paginator rows={5}>
                        <Column field="id" header="รหัสสินค้า"></Column>
                        <Column field="name" header="ชื่อสินค้า"></Column>
                        <Column field="type" header="ประเภท"></Column>
                        <Column field="stock" header="จำนวนคงเหลือ"></Column>
                    </DataTable>
                </Dialog>

                {/* ✅ Modal แสดงรายละเอียดคำสั่งซื้อสำเร็จ */}
                <Dialog header="✅ รายการคำสั่งซื้อสำเร็จ" visible={showCompletedDialog} style={{ width: '50vw' }} onHide={() => setShowCompletedDialog(false)}>
                    <DataTable value={completedOrders} paginator rows={5}>
                        <Column field="id" header="รหัสคำสั่งซื้อ"></Column>
                        <Column field="customer_name" header="ลูกค้า"></Column>
                        <Column field="total_amount" header="ยอดรวม"></Column>
                        <Column field="order_date" header="วันที่สั่งซื้อ"></Column>
                    </DataTable>
                </Dialog>

                {/* ✅ Modal แสดงรายละเอียดคำสั่งซื้อไม่สำเร็จ */}
                <Dialog header="❌ รายการคำสั่งซื้อไม่สำเร็จ" visible={showFailedDialog} style={{ width: '50vw' }} onHide={() => setShowFailedDialog(false)}>
                    <DataTable value={failedOrders} paginator rows={5}>
                        <Column field="id" header="รหัสคำสั่งซื้อ"></Column>
                        <Column field="customer_name" header="ลูกค้า"></Column>
                        <Column field="total_amount" header="ยอดรวม"></Column>
                        <Column field="order_date" header="วันที่สั่งซื้อ"></Column>
                    </DataTable>
                </Dialog>
            </Card>
        </div>
    );
};

export default Homeadmin;
