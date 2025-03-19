import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import moment from "moment";

const RepairHistory = () => {
    const [historyData, setHistoryData] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [repairRequests, setRepairRequests] = useState([]);
    const [filteredRepairs, setFilteredRepairs] = useState([]);

    useEffect(() => {
        fetchHistoryData();
    }, []);

    // ✅ ฟังก์ชันจัดรูปแบบวันที่
    const dateTemplate = (rowData) => {
        return moment(rowData.request_date).format("DD/MM/YYYY HH:mm");  // เปลี่ยนรูปแบบวันที่
    };

    useEffect(() => {
        let filtered = historyData;
        if (selectedStatus) {
            filtered = filtered.filter(req => req.status === selectedStatus);
        }
        if (searchText) {
            filtered = filtered.filter(req =>
                req.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                req.address?.addressLine?.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        setFilteredHistory(filtered);
    }, [selectedStatus, searchText, historyData]);

    const fetchHistoryData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/repair-requests/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await response.json();
            if (response.ok) {
                const filteredData = data.data.filter(req => req.status === "complete" || req.status === "cancle");
                setHistoryData(filteredData);
                setFilteredHistory(filteredData);
            }
        } catch (error) {
            console.error("❌ Error fetching history data:", error);
        }
    };

    // Template ปุ่มลบ
    const deleteButton = (rowData) => {
        return (
            <Button
                label="ลบ"
                icon="pi pi-trash"
                className="p-button-danger 
            p-button-sm" onClick={() => deleteRepairRequest(rowData.id)}>
            </Button>
        );
    };

    const deleteRepairRequest = async (repairId) => {
        if (!window.confirm("ต้องการลบคำขอซ่อมนี้หรือไม่?")) return;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API}/api/repair-requests/${repairId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            const data = await response.json();

            if (response.ok) {
                // ลบใน state ทุกจุดที่ใช้แสดงผล
                const newList = historyData.filter(req => req.id !== repairId);
                setHistoryData(newList);
                setFilteredHistory(newList);  // ✅ อัปเดตข้อมูลที่ใช้แสดงผล

                // หากใช้ repairRequests ที่อื่นก็อัปเดตด้วย
                setRepairRequests(newList);
                setFilteredRepairs(newList);
            } else {
                console.error("❌ Failed to delete request:", data.error);
            }
        } catch (error) {
            console.error("❌ Error deleting request:", error);
        }
    };

    const orderStatus = [
        { label: "ทั้งหมด", value: null },
        { label: "สำเร็จ", value: "complete" },
        { label: "ยกเลิก", value: "cancle" }
    ];

    const statusTemplate = (rowData) => (
        <Tag severity={rowData.status === "complete" ? "success" : "danger"} value={rowData.status === "complete" ? "สำเร็จ" : "ยกเลิก"} />
    );

    // Template แสดงรูป
    const imageTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '5px' }}>
                {rowData.images && rowData.images.length > 0 ? (
                    rowData.images.map((image, index) => (
                        <img
                            key={index}
                            src={`${process.env.REACT_APP_API}${image}`}
                            alt="repair-img"
                            width="50"
                            height="50"
                            style={{ borderRadius: '5px' }}
                        />
                    ))
                ) : (
                    <span>ไม่มีรูป</span>
                )}
            </div>
        );
    };

    return (
        <div>
            <DataTable value={filteredHistory} paginator rows={10}>
                <Column body={(rowData) => rowData.user?.username || "ไม่ระบุ"} header="ชื่อผู้ใช้" />
                <Column body={imageTemplate} header="รูปภาพ" />
                <Column field="service_type" header="ประเภทการซ่อม" />
                <Column field="problem_description" header="รายละเอียด" />
                <Column body={dateTemplate} header="วันที่แจ้งซ่อม" />
                <Column body={(rowData) => rowData.address?.addressLine || "ไม่ระบุ"} header="ที่อยู่" />
                <Column body={(rowData) => rowData.address?.province || "ไม่ระบุ"} header="จังหวัด" />
                <Column body={(rowData) => rowData.address?.district || "ไม่ระบุ"} header="เขต/อำเภอ" />
                <Column body={(rowData) => rowData.address?.subdistrict || "ไม่ระบุ"} header="ตำบล" />
                <Column body={(rowData) => rowData.address?.postalCode || "ไม่ระบุ"} header="รหัสไปรษณีย์" />
                <Column body={statusTemplate} field="status" header="สถานะ" />
                <Column
                    body={deleteButton}
                    header="ลบ"
                />
            </DataTable>
        </div>
    );
};

export default RepairHistory;
