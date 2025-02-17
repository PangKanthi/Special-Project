"use client";
import { useState } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Chart } from "primereact/chart";
import { Carousel } from "primereact/carousel";

const Homeadmin = () => {
    const [selectedMonth, setSelectedMonth] = useState("October");
    const revenueData = {
        labels: ["5k", "10k", "15k", "20k", "25k", "30k", "35k", "40k", "45k", "50k", "55k", "60k"],
        datasets: [
            {
                label: "Sales",
                data: [30, 50, 40, 60, 70, 100, 50, 80, 60, 90, 100, 70],
                backgroundColor: "rgba(165, 105, 189, 0.5)",
                borderColor: "#A569BD",
                borderWidth: 2,
                fill: true,
            },
            {
                label: "Profit",
                data: [20, 30, 25, 40, 50, 90, 35, 70, 50, 80, 90, 60],
                backgroundColor: "rgba(240, 128, 128, 0.5)",
                borderColor: "#E74C3C",
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const salesAnalyticsData = {
        labels: ["2015", "2016", "2017", "2018", "2019"],
        datasets: [
            {
                label: "Product A",
                data: [10, 30, 50, 75, 100],
                borderColor: "#2E86C1",
                fill: false,
                tension: 0.4,
            },
            {
                label: "Product B",
                data: [5, 25, 40, 60, 90],
                borderColor: "#16A085",
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const products = [
        { name: "ประตูไฟฟ้าอัตโนมัติ", price: "89,900 บาท" },
        { name: "Smart Lock", price: "55,000 บาท" },
        { name: "CCTV Security", price: "22,500 บาท" },
    ];

    const productTemplate = (product) => (
        <div className="text-center p-3">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-blue-500 font-medium">{product.price}</p>
        </div>
    );

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <Card className="mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Revenue</h3>
                    <div className="ml-auto">
                        <Dropdown
                            value={selectedMonth}
                            options={["October", "November", "December"]}
                            onChange={(e) => setSelectedMonth(e.value)}
                            placeholder="Select Month"
                        />
                    </div>
                </div>
                <Chart type="line" data={revenueData} />
            </Card>

            <div className="grid">
                {/* Customers Card */}
                <div className="col-12 md:col-4">
                    <Card className="h-full flex flex-column justify-content-center align-items-center">
                        <h3 className="text-xl font-semibold">Customers</h3>
                        <div className="flex justify-center my-3">
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    border: "5px solid #4A90E2",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span className="text-lg font-bold">📊</span>
                            </div>
                        </div>
                        <p className="text-lg font-bold">34,249</p>
                        <p className="text-sm text-gray-500">New Customers</p>
                        <p className="text-lg font-bold">1,420</p>
                        <p className="text-sm text-gray-500">Repeated</p>
                    </Card>
                </div>

                {/* Featured Product Carousel */}
                <div className="col-12 md:col-4">
                    <Card className="h-full flex flex-column justify-content-center align-items-center">
                        <h3 className="text-xl font-semibold text-center mb-3">Featured Product</h3>
                        <Carousel
                            value={products}
                            itemTemplate={productTemplate}
                            numVisible={1}
                            numScroll={1}
                        />
                    </Card>
                </div>

                <div className="col-12 md:col-4">
                    <Card className="h-full flex flex-column justify-content-center align-items-center">
                        <h3 className="text-xl font-semibold">Sales Analytics</h3>
                        <Chart type="line" data={salesAnalyticsData} />
                    </Card>
                </div>
            </div>

        </div>
    );
};

export default Homeadmin;
