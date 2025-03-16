import React, { useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useCompletedOrders from "./Homeadmin component/useCompletedOrders";
import useCompletedRepairs from "./Homeadmin component/useCompletedRepairs";
import useUserCount from "./Homeadmin component/useUserCount";
import useInventoryData from "./Homeadmin component/useInventoryData";
import useSalesData from "./Homeadmin component/useSalesData";
import useFailedOrders from "./Homeadmin component/useFailedOrders";

const Homeadmin = () => {
    const [selectedMonth, setSelectedMonth] = useState("Jan");
    const completedOrders = useCompletedOrders(selectedMonth);
    const completedRepairs = useCompletedRepairs(selectedMonth);
    const { totalStock, productStock } = useInventoryData();
    const [inventoryDialog, setInventoryDialog] = useState(false);
    const salesDataFromAPI = useSalesData(selectedMonth);
    const failedOrders = useFailedOrders(selectedMonth);
    const userCount = useUserCount();


    const months = [
        { label: "มกราคม", value: "Jan" },
        { label: "กุมภาพันธ์", value: "Feb" },
        { label: "มีนาคม", value: "Mar" },
        { label: "เมษายน", value: "Apr" },
        { label: "พฤษภาคม", value: "May" },
        { label: "มิถุนายน", value: "Jun" },
        { label: "กรกฎาคม", value: "Jul" },
        { label: "สิงหาคม", value: "Aug" },
        { label: "กันยายน", value: "Sep" },
        { label: "ตุลาคม", value: "Oct" },
        { label: "พฤศจิกายน", value: "Nov" },
        { label: "ธันวาคม", value: "Dec" }
    ];

    // ข้อมูลตัวอย่าง
    const data = {
        ordersCompleted: 120,
        inventory: 500,
        users: 80,
        repairsCompleted: 30,
        ordersFailed: 10,
        repairsFailed: 5,
        sales: [200, 300, 250, 400, 350, 450, 500, 600, 550, 700, 750, 800]
    };

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
            {/* Header */}
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="text-2xl font-semibold flex align-items-center">
                    📊 Dashboard ผู้ดูแลระบบ
                </h2>
                <Dropdown
                    value={selectedMonth}
                    options={months}
                    onChange={(e) => setSelectedMonth(e.value)}
                    placeholder="เลือกเดือน"
                    className="w-12rem"
                />
            </div>

            {/* Layout: การ์ด 6 อัน + กราฟยอดขาย */}
            <div className="grid">
                {/* ฝั่งซ้าย - การ์ด 6 อัน (ขยายกว้างขึ้น) */}
                <div className="col-12 md:col-5">
                    <div className="grid">
                        {[
                            { title: "คำสั่งซื้อสำเร็จ", value: completedOrders, color: "text-green-500", unit: "รายการ" },
                            { title: "คำสั่งซื้อไม่สำเร็จ", value: failedOrders, color: "text-red-500", unit: "รายการ" }, // ✅ ใช้ API จริง
                            { title: "สินค้าคงคลัง", value: totalStock, color: "text-blue-500", unit: "ชิ้น", onClick: () => setInventoryDialog(true) }, // ✅ เปิด Modal เมื่อคลิก
                            { title: "ผู้ใช้งาน", value: userCount, color: "text-purple-500", unit: "คน" },
                            { title: "คำขอซ่อมสำเร็จ", value: completedRepairs, color: "text-teal-500", unit: "รายการ" },
                            { title: "คำขอซ่อมไม่สำเร็จ", value: data.repairsFailed, color: "text-orange-500", unit: "รายการ" }
                        ].map((item, index) => (
                            <div className="col-6 p-2" key={index}>
                                <Card
                                    className="shadow-3 p-2 text-center hover:shadow-5 transition-all duration-300 cursor-pointer"
                                    onClick={item.onClick} // ✅ รองรับการคลิก
                                >
                                    <h4 className="text-gray-700 text-sm">{item.title}</h4>
                                    <h3 className={`font-bold text-md ${item.color}`}>{item.value} {item.unit}</h3>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ฝั่งขวา - กราฟยอดขาย (ลดขนาดลงให้สมดุล) */}
                <div className="col-12 md:col-7">
                    <Card title="ยอดขายรายเดือน" className="shadow-3 p-3">
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
                        }} style={{ height: "435px" }} />
                    </Card>
                </div>
            </div>
            {/* ✅ Modal แสดงรายละเอียดสินค้าคงคลัง */}
            <Dialog header="📦 รายการสินค้าคงคลัง" visible={inventoryDialog} style={{ width: '50vw' }} onHide={() => setInventoryDialog(false)}>
                <DataTable value={productStock} paginator rows={5}>
                    <Column field="id" header="รหัสสินค้า"></Column>
                    <Column field="name" header="ชื่อสินค้า"></Column>
                    <Column field="type" header="ประเภท"></Column>
                    <Column field="stock" header="จำนวนคงเหลือ"></Column>
                </DataTable>
            </Dialog>
        </div>
    );
};

export default Homeadmin;
