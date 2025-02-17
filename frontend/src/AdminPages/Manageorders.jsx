import React from 'react';
import Navbar from '../Navbar/Navadmin'; // ใช้ Navbar ของ Admin
import { Card } from "primereact/card";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Manageorders = () => {
    const orders = [
        { id: 1, customer: "John Doe", status: "Pending", total: "$120.00" },
        { id: 2, customer: "Jane Smith", status: "Shipped", total: "$250.50" },
        { id: 3, customer: "Michael Johnson", status: "Delivered", total: "$75.99" },
    ];

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-1/5">
                <Navbar />
            </div>

            {/* Content Area */}
            <div className="w-4/5 p-5">
                <h2 className="text-2xl font-bold mb-4">จัดการออเดอร์</h2>
                
                <Card className="p-4">
                    <h3 className="text-xl font-semibold mb-3">รายการคำสั่งซื้อ</h3>
                    <DataTable value={orders} responsiveLayout="scroll">
                        <Column field="id" header="Order ID"></Column>
                        <Column field="customer" header="Customer Name"></Column>
                        <Column field="status" header="Status"></Column>
                        <Column field="total" header="Total Amount"></Column>
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default Manageorders;
