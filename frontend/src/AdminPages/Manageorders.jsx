import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import axios from "axios";

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    // ดึงข้อมูล orders
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:1234/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // อัปเดตสถานะ
    const updateStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:1234/api/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // อัปเดตเฉพาะ orderId ที่ถูกเปลี่ยน
            setOrders((prevOrders) =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };


    // แสดงสีสถานะ
    const statusTemplate = (rowData) => {
        const statusColors = {
            pending: "warning",
            confirm: "info",
            complete: "success",
            cancle: "danger",
        };
        return <Tag value={rowData.status} severity={statusColors[rowData.status]} />;
    };

    // ดูสินค้าใน order
    const viewOrderItems = (order) => {
        setOrderItems(order.order_items);
        setVisibleItems(true);
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Order List</h2>

            <Card>
                {/* เพิ่ม dataKey="id" */}
                <DataTable value={orders} dataKey="id" paginator rows={10}>
                    <Column field="user.username" header="Username" sortable />
                    <Column field="address.addressLine" header="Address" sortable />
                    <Column
                        header="Items"
                        body={(rowData) => (
                            <Button
                                label="ดูสินค้า"
                                icon="pi pi-eye"
                                className="p-button-sm"
                                onClick={() => viewOrderItems(rowData)}
                            />
                        )}
                    />
                    <Column field="total_amount" header="Total Amount" sortable />

                    {/* คอลัมน์แสดงสถานะ */}
                    <Column
                        // field="status"
                        header="Status"
                        body={statusTemplate}
                        sortable
                    />

                    {/* คอลัมน์เปลี่ยนสถานะ */}
                    <Column
                        header="เปลี่ยนสถานะ"
                        body={(rowData) => (
                            <Dropdown
                                value={rowData.status}  // ใช้ค่าจากแต่ละ order
                                options={["pending", "confirm", "complete", "cancle"]}
                                onChange={(e) => updateStatus(rowData.id, e.value)}
                            />
                        )}
                    />
                </DataTable>
            </Card>

            {/* Dialog ดูสินค้า */}
            <Dialog
                header="รายการสินค้า"
                visible={visibleItems}
                style={{ width: "40vw" }}
                onHide={() => setVisibleItems(false)}
            >
                <DataTable value={orderItems}>
                    <Column field="product.id" header="Product ID" />
                    <Column
                        header="Image"
                        body={(rowData) => {
                            const fileName = rowData.product?.images?.[0];
                            const imageUrl = fileName
                                ? `http://localhost:1234/uploads/${fileName}`
                                : "https://via.placeholder.com/50";
                                console.log("Image URL:", imageUrl);


                            return (
                                <img
                                    src={imageUrl}
                                    alt="product"
                                    width="50"
                                />
                            );
                        }}
                    />
                    <Column field="quantity" header="Quantity" />
                    <Column field="price" header="Price" />
                </DataTable>
            </Dialog>
        </div>
    );
};

export default ManageOrders;
