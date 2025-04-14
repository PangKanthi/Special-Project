import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import moment from "moment";

const RepairHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [visibleItems, setVisibleItems] = useState(false);
  const [selectedRepairItem, setSelectedRepairItem] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [visibleAddressDialog, setVisibleAddressDialog] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  // ✅ ฟังก์ชันจัดรูปแบบวันที่
  const dateTemplate = (rowData) => {
    return moment(rowData.request_date).format("DD/MM/YYYY HH:mm"); // เปลี่ยนรูปแบบวันที่
  };

  useEffect(() => {
    let filtered = historyData;
    if (selectedStatus) {
      filtered = filtered.filter((req) => req.status === selectedStatus);
    }
    if (searchText) {
      filtered = filtered.filter(
        (req) =>
          req.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          req.address?.addressLine
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }
    setFilteredHistory(filtered);
  }, [selectedStatus, searchText, historyData]);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/repair-requests/all`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        const filteredData = data.data.filter(
          (req) => req.status === "complete" || req.status === "cancle"
        );
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
            p-button-sm"
        onClick={() => deleteRepairRequest(rowData.id)}
      ></Button>
    );
  };

  const deleteRepairRequest = async (repairId) => {
    if (!window.confirm("ต้องการลบคำขอซ่อมนี้หรือไม่?")) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/repair-requests/${repairId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        const newList = historyData.filter((req) => req.id !== repairId);
        setHistoryData(newList);
        setFilteredHistory(newList);

        toast.current.show({
          severity: "success",
          summary: "สำเร็จ",
          detail: "ลบคำขอซ่อมสำเร็จ",
          life: 3000,
        }); // Toast on success
      } else {
        toast.current.show({
          severity: "error",
          summary: "ข้อผิดพลาด",
          detail: "ไม่สามารถลบคำขอซ่อมได้",
          life: 3000,
        }); // Toast on error
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "ข้อผิดพลาด",
        detail: "เกิดข้อผิดพลาดในการลบคำขอซ่อม",
        life: 3000,
      }); // Toast on exception
    }
  };

  const viewRepairItem = (repair) => {
    setSelectedRepairItem(repair);
    setVisibleItems(true);
  };

  const viewAddress = (address) => {
    setSelectedAddress(address);
    setVisibleAddressDialog(true);
  };

  const orderStatus = [
    { label: "ทั้งหมด", value: null },
    { label: "สำเร็จ", value: "complete" },
    { label: "ยกเลิก", value: "cancle" },
  ];

  const statusTemplate = (rowData) => (
    <Tag
      severity={rowData.status === "complete" ? "success" : "danger"}
      value={rowData.status === "complete" ? "สำเร็จ" : "ยกเลิก"}
    />
  );

  // Template แสดงรูป
  const imageTemplate = (rowData) => {
    return (
      <div style={{ display: "flex", gap: "5px" }}>
        {rowData.images && rowData.images.length > 0 ? (
          rowData.images.map((image, index) => (
            <img
              key={index}
              src={`${process.env.REACT_APP_API}${image}`}
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

  return (
    <div>
      <Toast ref={toast} />
      <DataTable
        value={filteredHistory}
        paginator
        rows={10}
        sortField="request_date"
        sortOrder={-1}
      >
        <Column
          body={(rowData) => rowData.user?.username || "ไม่ระบุ"}
          header="ชื่อผู้ใช้"
        />
        <Column body={imageTemplate} header="รูปภาพ" />
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
        <Column
          field="request_date"
          body={dateTemplate}
          header="วันที่แจ้งซ่อม"
          sortable
        />
        <Column
          header="ที่อยู่"
          body={(rowData) => (
            <Button
              label="ดูที่อยู่"
              icon="pi pi-map-marker"
              className="p-button-sm"
              onClick={() => viewAddress(rowData.address)}
            />
          )}
        />
        <Column body={statusTemplate} field="status" header="สถานะ" sortable />
        <Column
          field="repair_price"
          header="ราคาซ่อม"
          body={(rowData) =>
            rowData.repair_price !== null
              ? Number(rowData.repair_price).toLocaleString("th-TH") + " บาท"
              : "-"
          }
        />
        <Column body={deleteButton} header="ลบ" />
      </DataTable>
      <Dialog
        header="รายละเอียดสินค้า"
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
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
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
      <Dialog
        header="รายละเอียดที่อยู่"
        visible={visibleAddressDialog}
        style={{ width: "50vw" }}
        onHide={() => setVisibleAddressDialog(false)}
      >
        {selectedAddress && (
          <DataTable value={[selectedAddress]} responsiveLayout="scroll">
            <Column field="addressLine" header="ที่อยู่" />
            <Column field="subdistrict" header="ตำบล" />
            <Column field="district" header="อำเภอ" />
            <Column field="province" header="จังหวัด" />
            <Column field="postalCode" header="รหัสไปรษณีย์" />
          </DataTable>
        )}
      </Dialog>
    </div>
  );
};

export default RepairHistory;
