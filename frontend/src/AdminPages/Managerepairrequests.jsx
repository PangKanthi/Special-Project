import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { TabMenu } from "primereact/tabmenu";
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import moment from "moment";

const API_URL = "http://localhost:1234/api/repair-requests/all";

const Managerepairrequests = ({ setNotifications }) => {
  const [repairRequests, setRepairRequests] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [activeIndex, setActiveIndex] = useState(0);
  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ตัวเลือกสถานะที่ต้องการให้ admin เลือก
  // สะกด "cancle" ให้ตรงกับ enum ใน Prisma
  const statusOptions = [
    { label: 'pending', value: 'pending' },
    { label: 'confirm', value: 'confirm' },
    { label: 'complete', value: 'complete' },
    { label: 'cancle', value: 'cancle' }
  ];

  useEffect(() => {
    fetchRepairRequests();
  }, []);

  useEffect(() => {
    filterRepairs(activeTab);
  }, [repairRequests, activeTab]);

  const fetchRepairRequests = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.data) {
        setRepairRequests(data.data);
        setFilteredRepairs(data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching repair requests:", error);
    }
  };

  const items = [
    { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
    { label: "รอการยืนยัน", value: "pending", icon: "pi pi-clock" },
    { label: "ได้รับการยืนยัน", value: "confirm", icon: "pi pi-check-circle" },
  ];

  const filterRepairs = (status) => {
    if (status === "ทั้งหมด") {
      setFilteredRepairs(repairRequests);
    } else {
      setFilteredRepairs(
        repairRequests.filter((repair) => repair.status === status)
      );
    }
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRowsPerPage(event.rows);
  };

  // ฟังก์ชันอัปเดตสถานะ
  const updateRepairStatus = async (repairId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:1234/api/repair-requests/${repairId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (response.ok) {
        // data.data คือ repair_request ที่อัปเดตแล้ว พร้อม address
        const updatedItem = data.data;
        // แทนที่ของเดิมใน state ด้วย updatedItem ตัวใหม่
        const newList = repairRequests.map(req =>
          req.id === updatedItem.id ? updatedItem : req
        );
        setRepairRequests(newList);
        setFilteredRepairs(newList);
      } else {
        console.error("Update failed:", data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ฟังก์ชันลบคำขอซ่อม
  const deleteRepairRequest = async (repairId) => {
    if (!window.confirm("ต้องการลบคำขอซ่อมนี้หรือไม่?")) return;
    try {
      const response = await fetch(
        `http://localhost:1234/api/repair-requests/${repairId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const data = await response.json();
      if (response.ok) {
        // ลบใน state
        const newList = repairRequests.filter((req) => req.id !== repairId);
        setRepairRequests(newList);
        setFilteredRepairs(newList);
      } else {
        console.error("❌ Failed to delete request:", data.error);
      }
    } catch (error) {
      console.error("❌ Error deleting request:", error);
    }
  };

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

  // Template แสดง Status เป็น Tag
  const statusTemplate = (rowData) => {
    const statusColors = {
      pending: 'warning',
      confirm: 'info',
      complete: 'success',
      cancle: 'danger'
    };
    return <Tag value={rowData.status} severity={statusColors[rowData.status] || 'info'} />;
  };

  // Template Dropdown สำหรับเปลี่ยนสถานะ
  const statusEditor = (rowData) => {
    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => updateRepairStatus(rowData.id, e.value)}
      />
    );
  };

  // Template ปุ่มลบ
  const deleteButton = (rowData) => {
    return (
      <button onClick={() => deleteRepairRequest(rowData.id)}>
        ลบ
      </button>
    );
  };

  // ✅ ฟังก์ชันจัดรูปแบบวันที่
  const dateTemplate = (rowData) => {
    return moment(rowData.request_date).format("DD/MM/YYYY HH:mm");  // เปลี่ยนรูปแบบวันที่
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold">แจ้งซ่อม</h1>
      <Card>
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveTab(e.value.value);
            setActiveIndex(items.findIndex((tab) => tab.value === e.value.value));
            filterRepairs(e.value.value);
          }}
        />

        <DataTable
          value={repairRequests.filter(req => req.status !== "complete" && req.status !== "cancle")}
          emptyMessage="ไม่มีรายการแจ้งซ่"
          paginator
          rows={rowsPerPage}
          first={first}
          onPage={onPageChange}
          style={{ marginTop: '1rem' }}
        >
          <Column body={(rowData) => rowData.user?.username || "ไม่ระบุ"} header="Username" />
          <Column field="service_type" header="ประเภทการซ่อม" />
          <Column field="problem_description" header="รายละเอียด" />
          <Column body={dateTemplate} header="วันที่แจ้งซ่อม" />
          <Column body={(rowData) => rowData.address?.addressLine || "ไม่มี"} header="ที่อยู่" />
          <Column body={(rowData) => rowData.address?.province || "ไม่มี"} header="จังหวัด" />
          <Column body={(rowData) => rowData.address?.district || "ไม่มี"} header="เขต/อำเภอ" />
          <Column body={(rowData) => rowData.address?.subdistrict || "ไม่มี"} header="ตำบล" />
          <Column body={(rowData) => rowData.address?.postalCode || "ไม่มี"} header="รหัสไปรษณีย์" />

          <Column body={imageTemplate} header="รูปภาพ" />
          <Column body={statusTemplate} field="status" header="สถานะ" />
          <Column body={statusEditor} header="เปลี่ยนสถานะ" />
          <Column body={deleteButton} header="ลบ" />
        </DataTable>
      </Card>
    </div>
  );
};

export default Managerepairrequests;
