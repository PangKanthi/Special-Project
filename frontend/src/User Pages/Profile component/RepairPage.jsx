import React, { useState, useEffect } from "react";
import { TabMenu } from "primereact/tabmenu";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import moment from "moment";

const RepairPage = () => {
    const [repairRequests, setRepairRequests] = useState([]);
    const [activeTab, setActiveTab] = useState("ทั้งหมด");
    const [activeIndex, setActiveIndex] = useState(0);
    const [filteredRepairs, setFilteredRepairs] = useState([]);
    const [first, setFirst] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchRepairRequests();
    }, []);

    useEffect(() => {
        filterRepairs(activeTab);
    }, [repairRequests, activeTab]);

    // ✅ ฟังก์ชันจัดรูปแบบวันที่
    const dateTemplate = (rowData) => {
        return moment(rowData.request_date).format("DD/MM/YYYY HH:mm");  // เปลี่ยนรูปแบบวันที่
    };


    const fetchRepairRequests = async () => {
        try {
            const response = await fetch(`http://localhost:1234/api/repair-requests`, {
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
                            src={`http://localhost:1234${image}`} // ✅ แก้ path
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

        switch (rowData.status) {
            case "pending":
                severity = "warning"; // สีเหลือง
                break;
            case "confirm":
                severity = "info"; // สีฟ้า
                break;
            case "complete":
                severity = "success"; // สีแดง
                break;
            case "cancle":
                severity = "danger"; // สีแดง
                break;
            default:
                severity = "secondary"; // สีฟ้า

        }

        return <Tag value={rowData.status} severity={severity} />;
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
        </div>
    );
};

export default RepairPage;
