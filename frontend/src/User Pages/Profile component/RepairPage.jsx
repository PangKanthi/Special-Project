import React, { useState, useEffect } from "react";
import { TabMenu } from "primereact/tabmenu";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import moment from "moment";

const RepairPage = () => {
    const [repairRequests, setRepairRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("ทั้งหมด");
    const [activeIndex, setActiveIndex] = useState(0);
    const [filteredRepairs, setFilteredRepairs] = useState([]);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [visibleItems, setVisibleItems] = useState(false);
    const [selectedRepairItem, setSelectedRepairItem] = useState(null);

    useEffect(() => {
        fetchRepairRequests();
    }, []);

    useEffect(() => {
        filterRepairs(activeTab);
    }, [repairRequests, activeTab]);

    const viewRepairItem = (repair) => {
        setSelectedRepairItem(repair);
        setVisibleItems(true);
    };

    const dateTemplate = (rowData) => {
        return moment(rowData.request_date).format("DD/MM/YYYY HH:mm");  // เปลี่ยนรูปแบบวันที่
    };

    const fetchRepairRequests = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/repair-requests`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (data.data) {
                setRepairRequests(data.data);
            }
        } catch (error) {
            console.error("❌ Error fetching repair requests:", error);
        }
    };

    const items = [
        { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
        { label: "รอการยืนยัน", value: "pending", icon: "pi pi-clock" },
        { label: "ได้รับการยืนยันแล้ว", value: "confirm", icon: "pi pi-check-circle" },
        { label: "เสร็จแล้ว", value: "complete", icon: "pi pi-check" },
        { label: "ยกเลิก", value: "cancle", icon: "pi pi-times-circle" },
    ];

    const filterRepairs = (status) => {
        if (status === "ทั้งหมด") {
            setFilteredRepairs(repairRequests);
        } else {
            setFilteredRepairs(repairRequests.filter((repair) => repair.status === status));
        }
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRowsPerPage(event.rows);
    };

    const imageTemplate = (rowData) => {
        return (
            <div>
                {rowData.images && rowData.images.length > 0 ? (
                    rowData.images.map((image, index) => (
                        <img
                            key={index}
                            src={`${process.env.REACT_APP_API}${image}`} // ✅ แก้ path
                            alt="repair-img"
                            width="50"
                            height="50"
                            style={{ marginRight: "5px" }}
                        />
                    ))
                ) : (
                    <span>ไม่มีรูป</span>
                )}
            </div>
        );
    };

    const statusTemplate = (rowData) => {
        let severity = "";
        let statusText = "";

        switch (rowData.status) {
            case "pending":
                severity = "warning"; // สีเหลือง
                statusText = "รอการยืนยัน";
                break;
            case "confirm":
                severity = "info"; // สีฟ้า
                statusText = "ได้รับการยืนยันแล้ว";
                break;
            case "complete":
                severity = "success"; // สีแดง
                statusText = "เสร็จแล้ว";
                break;
            case "cancle":
                severity = "danger"; // สีแดง
                statusText = "ยกเลิก";
                break;
            default:
                severity = "secondary"; // สีฟ้า
                statusText = "ไม่ระบุ";

        }

        return <Tag value={statusText} severity={severity} />;
    };


    return (
        <div>
            <TabMenu
                model={items}
                activeIndex={activeIndex}
                onTabChange={(e) => {
                    setActiveTab(e.value.value);
                    setActiveIndex(items.findIndex(tab => tab.value === e.value.value));
                    filterRepairs(e.value.value);
                }}
            />

            <DataTable
                value={filteredRepairs}
                emptyMessage="ไม่มีรายการแจ้งซ่อม"
                paginator
                rows={rowsPerPage}
                first={first}
                onPage={onPageChange}
            >
                <Column field="service_type" header="ประเภทการซ่อม" />
                <Column
                    header="สินค้าแจ้งซ่อม"
                    body={(rowData) => (
                        <Button
                            label="ดูสินค้า"
                            icon="pi pi-eye"
                            className="p-button-sm"
                            onClick={() => viewRepairItem(rowData)}
                        />
                    )}
                />
                <Column field="problem_description" header="รายละเอียด" />
                <Column body={dateTemplate} header="วันที่แจ้งซ่อม" />
                <Column field="address.addressLine" header="ที่อยู่" />
                <Column field="address.province" header="จังหวัด" />
                <Column field="address.district" header="เขต/อำเภอ" />
                <Column field="address.subdistrict" header="ตำบล" />
                <Column field="address.postalCode" header="รหัสไปรษณีย์" />
                <Column body={imageTemplate} header="รูปภาพ" />
                <Column body={statusTemplate} field="status" header="สถานะ" />
            </DataTable>
            <Dialog
                header="สินค้าแจ้งซ่อม"
                visible={visibleItems}
                style={{ width: "70vw" }}
                onHide={() => setVisibleItems(false)}
            >
                {selectedRepairItem && (
                    <div className="p-4">
                        <DataTable value={[selectedRepairItem]} responsiveLayout="scroll">
                            <Column field="product_name" header="ชื่อสินค้า" />
                            <Column
                                header="รูปสินค้า"
                                body={(rowData) => (
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {rowData.product_image?.map((img, index) => (
                                            <img
                                                key={index}
                                                src={`${process.env.REACT_APP_API}${img}`}
                                                alt={`รูปที่ ${index + 1}`}
                                                style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                                            />
                                        ))}
                                    </div>
                                )}
                            />
                            <Column field="color" header="สี" />
                            <Column field="width" header="กว้าง (ม.)" />
                            <Column field="length" header="ยาว (ม.)" />
                            <Column field="thickness" header="ความหนา" />
                            <Column field="installOption" header="ตัวเลือกติดตั้ง" />
                            <Column field="quantity" header="จำนวน" />
                            <Column
                                field="price"
                                header="ราคา/ต่อชิ้น (บาท)"
                                body={(rowData) => rowData.price?.toLocaleString()}
                            />
                        </DataTable>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default RepairPage;
