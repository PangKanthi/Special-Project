import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import useCompletedOrders from "./Homeadmin component/useCompletedOrders";
import useCompletedRepairs from "./Homeadmin component/useCompletedRepairs";
import useSalesData from "./Homeadmin component/useSalesData";
import useUserCount from "./Homeadmin component/useUserCount";
import useInventoryData from "./Homeadmin component/useInventoryData";

const Homeadmin = () => {
    const completedOrders = useCompletedOrders();
    const completedRepairs = useCompletedRepairs();
    const salesData = useSalesData();
    const userCount = useUserCount();
    const { totalStock, productStock } = useInventoryData();

    const chartConfig = {
        labels: salesData.map(item => item.name),
        datasets: [
            {
                label: "ยอดขาย (บาท)",
                data: salesData.map(item => item.sales),
                backgroundColor: ["#FFC107", "#00BFFF", "#E91E63", "#9C27B0"],
            },
        ],
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="flex justify-between align-items-center gap-4 flex-wrap">
                {/* Box 1 */}
                <Card className="p-4 flex-1 text-center shadow-lg border-round-3xl" style={{ background: "#f1b81e", color: "#fff" }}>
                    <div className="text-3xl font-bold">{completedOrders}</div>
                    <div className="text-xl mt-2">คำสั่งซื้อที่สำเร็จ</div>
                    <i className="pi pi-shopping-cart text-3xl mt-2"></i>
                </Card>

                <Card className="p-4 flex-1 text-center shadow-lg border-round-3xl" style={{ background: "#673AB7", color: "#fff" }}>
                    <div className="text-3xl font-bold">{totalStock}</div>
                    <div className="text-xl mt-2">สินค้าคงคลัง</div>
                    <i className="pi pi-box text-3xl mt-2"></i>
                </Card>

                <Card className="p-4 flex-1 text-center shadow-lg border-round-3xl" style={{ background: "#03A9F4", color: "#fff" }}>
                    <div className="text-3xl font-bold">{userCount}</div>
                    <div className="text-xl mt-2">ผู้ใช้งาน</div>
                    <i className="pi pi-users text-3xl mt-2"></i>
                </Card>

                <Card className="p-4 flex-1 text-center shadow-lg border-round-3xl" style={{ background: "#E91E63", color: "#fff" }}>
                    <div className="text-3xl font-bold">{completedRepairs}</div>
                    <div className="text-xl mt-2">คำขอซ่อมที่สำเร็จ</div>
                    <i className="pi pi-wrench text-3xl mt-2"></i>
                </Card>
            </div>

            <div className="bg-gray-100 shadow-lg rounded-lg p-6 mt-5">
                <h4 className="text-2xl font-semibold text-center mb-4 text-gray-900">
                    📦 รายละเอียดสินค้าคงเหลือ
                </h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        {/* 🟢 หัวตาราง */}
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="py-3 px-4 text-center">ชื่อสินค้า</th>
                                <th className="py-3 px-4 text-center">จำนวน</th>
                                <th className="py-3 px-4 text-center">สถานะ</th>
                            </tr>
                        </thead>

                        {/* 🔵 เนื้อหาตาราง */}
                        <tbody>
                            {productStock.length > 0 ? (
                                productStock.map((item, index) => {
                                    let stockColor = "text-green-600";
                                    let statusText = "มีของ";
                                    let statusBg = "bg-green-200 text-green-700";

                                    if (item.stock < 10) {
                                        stockColor = "text-yellow-500";
                                        statusText = "ใกล้หมด";
                                        statusBg = "bg-yellow-200 text-yellow-700";
                                    }
                                    if (item.stock <= 0) {
                                        stockColor = "text-red-600";
                                        statusText = "ต้องเติมของ";
                                        statusBg = "bg-red-200 text-red-700";
                                    }

                                    return (
                                        <tr key={index} className="border-b border-gray-300 hover:bg-gray-100 transition-all">
                                            {/* ✅ ปรับสีชื่อสินค้าให้เข้มขึ้น */}
                                            <td className="py-3 px-4 text-center text-gray-900 font-semibold hover:text-blue-600 transition-all">
                                                {item.name}
                                            </td>
                                            <td className={`py-3 px-4 text-center font-bold ${stockColor}`}>
                                                {item.stock} ชิ้น
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBg}`}>
                                                    {statusText}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">ไม่มีข้อมูลสินค้า</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>




            {/* ✅ กราฟยอดขาย */}
            <Card className="p-6 shadow-lg bg-gray-50 mt-5 rounded-lg">
                <h4 className="text-2xl font-semibold text-center text-blue-600">
                    📊 ยอดขายรายเดือน
                </h4>
                <Chart
                    type="bar"
                    data={{
                        ...chartConfig,
                        datasets: chartConfig.datasets.map(dataset => ({
                            ...dataset,
                            backgroundColor: "#4CAF50", // ✅ สีแถบกราฟเขียวสดใส
                            borderColor: "#388E3C", // ✅ เส้นขอบเข้มขึ้น
                            borderWidth: 2
                        }))
                    }}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString() + " ฿";
                                    },
                                    color: "#333333", // ✅ เปลี่ยนสีเป็นดำเทา
                                },
                                grid: {
                                    color: "#E0E0E0" // ✅ ทำเส้นตารางจางลง
                                }
                            },
                            x: {
                                ticks: {
                                    color: "#333333", // ✅ เปลี่ยนสีเป็นดำเทา
                                },
                                grid: {
                                    color: "rgba(0, 0, 0, 0.1)" // ✅ ทำเส้นตาราง X จางลง
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                backgroundColor: "rgba(0,0,0,0.8)", // ✅ ทำให้ Tooltip ดูเข้มขึ้น
                                titleColor: "#ffffff",
                                bodyColor: "#ffffff",
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return `ยอดขาย: ${tooltipItem.raw.toLocaleString()} ฿`;
                                    }
                                }
                            }
                        }
                    }}
                />
            </Card>


            {/* ✅ สรุปยอดขายรายเดือน */}
            <div className="bg-gray-50 shadow-lg rounded-lg p-6 mt-5">
                <h4 className="text-2xl font-semibold text-center text-blue-600 mb-4">
                    📅 สรุปยอดขายรายเดือน
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {salesData.length > 0 ? (
                        salesData.map((item, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white shadow-md rounded-xl text-center flex flex-col items-center justify-center min-h-[120px] 
                               hover:shadow-lg transform hover:scale-105 transition-all"
                            >
                                <h5 className="font-semibold text-gray-800">{item.name}</h5>
                                <p className={`text-lg font-bold ${item.sales > 0 ? "text-green-600" : "text-red-500"}`}>
                                    {item.sales.toLocaleString()} ฿
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-6">ไม่มีข้อมูลยอดขาย</p>
                    )}
                </div>
            </div>


        </div>
    );
};

export default Homeadmin;
