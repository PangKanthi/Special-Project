import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { TabMenu } from "primereact/tabmenu";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import moment from "moment";

const API_URL = "http://localhost:1234/api";

const Managerepairrequests = ({ setNotifications }) => {
  const [repairRequests, setRepairRequests] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [activeIndex, setActiveIndex] = useState(0);

  const [partsFirst, setPartsFirst] = useState(0);
  const [partsRows, setPartsRows] = useState(5);

  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [partsDialogVisible, setPartsDialogVisible] = useState(false);
  const [addressDialogVisible, setAddressDialogVisible] = useState(false);

  const openAddressDialog = (rowData) => {
    setSelectedRequest(rowData);
    setAddressDialogVisible(true);
  };
  const closeAddressDialog = () => {
    setSelectedRequest(null);
    setAddressDialogVisible(false);
  };

  const openPartsDialog = (rowData) => {
    setSelectedRequest(rowData);
    setSelectedParts({});
    setPartsDialogVisible(true);
  };
  const closePartsDialog = () => {
    setSelectedRequest(null);
    setPartsDialogVisible(false);
    setPartsFirst(0);
  };

  const handleQuantityChange = (productId, value) => {
    setSelectedParts((prev) => ({ ...prev, [productId]: value }));
  };

  const confirmSelectedParts = async () => {
    if (!selectedRequest) return;

    const selectedPartsArray = Object.entries(selectedParts)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity_used]) => ({
        productId: parseInt(productId, 10),
        quantity_used,
      }));

    if (selectedPartsArray.length === 0) {
      alert("กรุณาเลือกจำนวนอะไหล่ที่ต้องการใช้");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/repair-requests/add-parts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          repairRequestId: selectedRequest.id,
          parts: selectedPartsArray,
        }),
      });

      if (response.ok) {
        setPartsDialogVisible(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Error adding parts to repair request:", error);
    }
  };

  const statusOptions = [
    { label: "pending", value: "pending" },
    { label: "confirm", value: "confirm" },
    { label: "complete", value: "complete" },
    { label: "cancle", value: "cancle" },
  ];

  useEffect(() => {
    fetchRepairRequests();
    fetchParts();
  }, []);

  useEffect(() => {
    filterRepairs(activeTab);
  }, [repairRequests, activeTab]);

  const fetchRepairRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/repair-requests/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  const fetchParts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/parts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setParts(data || []);
    } catch (error) {
      console.error("❌ Error fetching parts:", error);
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

  const updateRepairStatus = async (repairId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:1234/api/repair-requests/${repairId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const updatedItem = data.data;
        const newList = repairRequests.map((req) =>
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

  const imageTemplate = (rowData) => {
    return (
      <div style={{ display: "flex", gap: "5px" }}>
        {rowData.images && rowData.images.length > 0 ? (
          rowData.images.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:1234${image}`}
              alt="repair-img"
              width="50"
              height="50"
              style={{ borderRadius: "5px" }}
            />
          ))
        ) : (
          <span>ไม่มีรูป</span>
        )}
      </div>
    );
  };

  const statusTemplate = (rowData) => {
    const statusColors = {
      pending: "warning",
      confirm: "info",
      complete: "success",
      cancle: "danger",
    };
    return (
      <Tag
        value={rowData.status}
        severity={statusColors[rowData.status] || "info"}
      />
    );
  };

  const statusEditor = (rowData) => {
    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => updateRepairStatus(rowData.id, e.value)}
      />
    );
  };

  const dateTemplate = (rowData) => {
    return moment(rowData.request_date).format("DD/MM/YYYY HH:mm");
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold">การจัดการคำขอแจ้งซ่อม</h1>
      <Card>
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveTab(e.value.value);
            setActiveIndex(
              items.findIndex((tab) => tab.value === e.value.value)
            );
            filterRepairs(e.value.value);
          }}
        />

        <DataTable
          value={repairRequests.filter(
            (req) => req.status !== "complete" && req.status !== "cancle"
          )}
          emptyMessage="ไม่มีรายการแจ้งซ่อม"
          paginator
          rows={rowsPerPage}
          first={first}
          onPage={onPageChange}
          style={{ marginTop: "1rem" }}
        >
          <Column
            body={(rowData) => rowData.user?.firstname || "ไม่ระบุ"}
            header="ชื่อจริง"
          />
          <Column
            body={(rowData) => rowData.user?.lastname || "ไม่ระบุ"}
            header="นามสกุล"
          />
          <Column
            body={(rowData) => rowData.user?.phone || "ไม่ระบุ"}
            header="เบอร์โทรศัพท์"
          />
          <Column field="service_type" header="ประเภทการซ่อม" />
          <Column field="problem_description" header="รายละเอียด" />
          <Column body={dateTemplate} header="วันที่แจ้งซ่อม" />
          <Column
            header="ที่อยู่"
            body={(rowData) => (
              <Button
                label="ดูที่อยู่"
                className="p-button-text p-button-sm"
                onClick={() => openAddressDialog(rowData)}
              />
            )}
          />

          <Column body={imageTemplate} header="รูปภาพ" />
          <Column
            header="เลือกอะไหล่"
            body={(rowData) => (
              <Button
                label="เลือกอะไหล่"
                className="p-button-outlined p-button-sm"
                onClick={() => openPartsDialog(rowData)}
              />
            )}
          />
          <Column body={statusTemplate} field="status" header="สถานะ" />
          <Column body={statusEditor} header="เปลี่ยนสถานะ" />
        </DataTable>
      </Card>

      <Dialog
        header={`ที่อยู่ของ ${selectedRequest?.user?.username || "ผู้ใช้"}`}
        visible={addressDialogVisible}
        style={{ width: "50vw" }}
        onHide={closeAddressDialog}
      >
        <DataTable
          value={selectedRequest ? [selectedRequest.address] : []}
          emptyMessage="ไม่มีที่อยู่"
        >
          <Column field="addressLine" header="ที่อยู่" />
          <Column field="province" header="จังหวัด" />
          <Column field="district" header="เขต/อำเภอ" />
          <Column field="subdistrict" header="ตำบล" />
          <Column field="postalCode" header="รหัสไปรษณีย์" />
        </DataTable>
      </Dialog>

      <Dialog
        header="เลือกอะไหล่ที่ใช้ในการซ่อม"
        visible={partsDialogVisible}
        style={{ width: "50vw" }}
        onHide={closePartsDialog}
      >
        <DataTable
          value={parts}
          emptyMessage="ไม่มีอะไหล่"
          paginator
          rows={partsRows}
          first={partsFirst}
          onPage={(e) => {
            setPartsFirst(e.first);
            setPartsRows(e.rows);
          }}
        >
          <Column
            header="รูป"
            body={(rowData) =>
              rowData.images && rowData.images.length > 0 ? (
                <img
                  src={`http://localhost:1234${rowData.images[0]}`}
                  alt="product-img"
                  width="50"
                  height="50"
                  style={{ borderRadius: "5px" }}
                />
              ) : (
                <span>ไม่มีรูป</span>
              )
            }
          />
          <Column field="name" header="ชื่ออะไหล่" />
          <Column field="stock_quantity" header="สต็อกที่มี" />
          <Column
            header="จำนวนที่ใช้"
            body={(rowData) => (
              <InputNumber
                value={selectedParts[rowData.id] || 0}
                onValueChange={(e) => handleQuantityChange(rowData.id, e.value)}
                min={0}
              />
            )}
          />
        </DataTable>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <Button
            label="ยกเลิก"
            onClick={closePartsDialog}
            className="p-button-text"
          />
          <Button
            label="ยืนยัน"
            onClick={confirmSelectedParts}
            className="p-button-primary"
            style={{ marginLeft: "10px" }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Managerepairrequests;
