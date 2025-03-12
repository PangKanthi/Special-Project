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
            const response = await fetch("http://localhost:1234/api/repair-requests/all", {
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
                            src={`http://localhost:1234${image}`}
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
                <Column body={(rowData) => rowData.user?.username || "ไม่ระบุ"} header="Username" />
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
            </DataTable>
        </div>
    );
};

export default RepairHistory;
