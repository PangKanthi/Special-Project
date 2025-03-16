import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [visibleAddress, setVisibleAddress] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
        { label: "รอการยืนยัน", value: "pending", icon: "pi pi-clock" },
        { label: "ได้รับการยืนยันแล้ว", value: "confirm", icon: "pi pi-check-circle" },
        { label: "เสร็จแล้ว", value: "complete", icon: "pi pi-check" },
        { label: "ยกเลิก", value: "cancle", icon: "pi pi-times-circle" },
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    // ดึงข้อมูลออเดอร์
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${process.env.REACT_APP_API}/api/orders/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("📌 Orders from API:", response.data.data);
            setOrders(response.data.data);  // ✅ ดึงเฉพาะออเดอร์ของ user คนนั้น
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const filterOrdersByStatus = (status) => {
        if (status === "ทั้งหมด") return orders.filter(order => order.status !== "complete" && order.status !== "cancel");
        return orders.filter(order => order.status === status);
    };

    // แสดงสีของสถานะออเดอร์
    const statusTemplate = (rowData) => {
        const statusColors = {
            pending: "warning",
            confirm: "info",
            complete: "success",
            cancel: "danger",
        };
        return <Tag value={rowData.status} severity={statusColors[rowData.status]} />;
    };

    // ฟังก์ชันแสดงรูปภาพสินค้า
    const ImageTemplate = (rowData) => {
        const images = rowData.rowData.product?.images || [];

        return (
            <div style={{ display: 'flex', gap: '5px' }}>
                {images.length > 0 ? (
                    images.map((image, index) => {
                        const imageUrl = `${process.env.REACT_APP_API}${image}`;
                        return (
                            <img
                                key={index}
                                src={imageUrl}
                                alt="repair-img"
                                width="50"
                                height="50"
                                style={{ borderRadius: '5px' }}
                                onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }}
                            />
                        );
                    })
                ) : (
                    <span>ไม่มีรูป</span>
                )}
            </div>
        );
    };


    const viewOrderItems = (order) => {
        setOrderItems(order.order_items);
        setVisibleItems(true);
    };

    const viewAddressDetails = (order) => {
        setSelectedAddress(order.address);
        setVisibleAddress(true);
    };

    return (
        <div>
            <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                {items.map((tab, index) => (
                    <TabPanel key={index} header={
                        <div>
                            <i className={tab.icon} style={{ marginRight: '5px' }}></i>
                            {tab.label}
                        </div>
                    }>
                        <DataTable 
                        value={filterOrdersByStatus(tab.value)} dataKey="id" paginator rows={10}>
                            <Column header="ID" body={(rowData) => rowData.user?.id || "-"} />
                            <Column header="ชื่อ" body={(rowData) => rowData.user?.firstname || "-"} />
                            <Column header="นามสกุล" body={(rowData) => rowData.user?.lastname || "-"} />
                            <Column header="เบอร์โทรศัพท์" body={(rowData) => rowData.user?.phone || "-"} />
                            <Column
                                header="ที่อยู่"
                                body={(rowData) => (
                                    <Button
                                        label="ดูที่อยู่"
                                        icon="pi pi-map-marker"
                                        className="p-button-sm"
                                        onClick={() => viewAddressDetails(rowData)}
                                    />
                                )}
                            />
                            <Column
                                header="รายการสินค้า"
                                body={(rowData) => (
                                    <Button
                                        label="ดูสินค้า"
                                        icon="pi pi-eye"
                                        className="p-button-sm"
                                        onClick={() => viewOrderItems(rowData)}
                                    />
                                )}
                            />
                            <Column field="total_amount" header="ยอดรวมทั้งหมด" />
                            <Column header="สถานะ" body={statusTemplate} />
                        </DataTable>
                    </TabPanel>
                ))}
            </TabView>

            {/* Dialog ดูสินค้า */}
            <Dialog
                header="รายการสินค้า"
                visible={visibleItems}
                draggable={false}
                style={{ width: "40vw" }}
                onHide={() => setVisibleItems(false)}
            >
                <DataTable value={orderItems}>
                    <Column field="product.id" header="Product ID" />
                    <Column header="Image" body={(rowData) => <ImageTemplate rowData={rowData} />} />
                    <Column field="quantity" header="Quantity" />
                    <Column field="price" header="Price" />
                </DataTable>
            </Dialog>

            <Dialog header="รายละเอียดที่อยู่" visible={visibleAddress} style={{ width: "50vw" }} onHide={() => setVisibleAddress(false)}>
                {selectedAddress ? (
                    <DataTable value={[selectedAddress]}>
                        <Column field="addressLine" header="ที่อยู่" />
                        <Column field="subdistrict" header="ตำบล/แขวง" />
                        <Column field="district" header="อำเภอ/เขต" />
                        <Column field="province" header="จังหวัด" />
                        <Column field="postalCode" header="รหัสไปรษณีย์" />
                    </DataTable>
                ) : (
                    <p>ไม่มีข้อมูลที่อยู่</p>
                )}
            </Dialog>

        </div>
    );
};

export default OrderPage;
