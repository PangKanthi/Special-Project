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
            {/* ✅ กล่องข้อมูลหลัก */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg bg-yellow-500 text-black">
                    <i className="pi pi-shopping-cart text-5xl mb-2"></i>
                    <h4 className="text-lg font-semibold">คำสั่งซื้อที่สำเร็จ</h4>
                    <p className="text-4xl font-bold">{completedOrders}</p>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg bg-blue-500 text-white">
                    <i className="pi pi-box text-5xl mb-2"></i>
                    <h4 className="text-lg font-semibold">สินค้าคงคลัง</h4>
                    <p className="text-4xl font-bold">{totalStock}</p>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg bg-pink-500 text-white">
                    <i className="pi pi-users text-5xl mb-2"></i>
                    <h4 className="text-lg font-semibold">ผู้ใช้งาน</h4>
                    <p className="text-4xl font-bold">{userCount}</p>
                </Card>

                <Card className="p-6 flex flex-col items-center justify-center shadow-md rounded-lg bg-purple-500 text-white">
                    <i className="pi pi-wrench text-5xl mb-2"></i>
                    <h4 className="text-lg font-semibold">คำขอซ่อมที่สำเร็จ</h4>
                    <p className="text-4xl font-bold">{completedRepairs}</p>
                </Card>
            </div>

            {/* ✅ รายละเอียดสินค้าคงเหลือ */}
            <div className="bg-gray-800 shadow-md rounded-lg p-6">
                <h4 className="text-lg font-semibold text-center mb-4">📦 รายละเอียดสินค้าคงเหลือ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productStock.length > 0 ? (
                        productStock.map((item, index) => {
                            let stockColor = "text-green-400";
                            if (item.stock < 10) stockColor = "text-yellow-400";
                            if (item.stock <= 0) stockColor = "text-red-500";

                            return (
                                <div key={index} className="p-4 bg-gray-700 shadow-md rounded-md text-center">
                                    <h5 className="font-semibold">{item.name}</h5>
                                    <p className={`text-lg font-bold ${stockColor}`}>
                                        {item.stock} ชิ้น
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 col-span-3">ไม่มีข้อมูลสินค้า</p>
                    )}
                </div>
            </div>

            {/* ✅ กราฟยอดขาย */}
            <Card className="p-6 shadow-md bg-gray-800">
                <h4 className="text-lg font-semibold text-center">📊 ยอดขายรายเดือน</h4>
                <Chart
                    type="bar"
                    data={chartConfig}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString() + " ฿";
                                    },
                                    color: "#ffffff",
                                },
                            },
                            x: {
                                ticks: {
                                    color: "#ffffff",
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return `ยอดขาย: ${tooltipItem.raw.toLocaleString()} ฿`;
                                    },
                                },
                            },
                        },
                    }}
                />
            </Card>

            {/* ✅ สรุปยอดขายรายเดือน */}
            <div className="bg-gray-800 shadow-md rounded-lg p-6">
                <h4 className="text-lg font-semibold text-center mb-4">📅 สรุปยอดขายรายเดือน</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {salesData.length > 0 ? (
                        salesData.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-700 shadow-md rounded-md text-center">
                                <h5 className="font-semibold">{item.name}</h5>
                                <p className="text-blue-400 font-bold">{item.sales.toLocaleString()} ฿</p>
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
