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
import { InputText } from "primereact/inputtext";
import moment from "moment";

const API_URL = `${process.env.REACT_APP_API}/api`;

const Managerepairrequests = ({ setNotifications }) => {
  const [repairRequests, setRepairRequests] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [activeIndex, setActiveIndex] = useState(0);

  const [partsFirst, setPartsFirst] = useState(0);
  const [partsRows, setPartsRows] = useState(5);
  const [repairPrice, setRepairPrice] = useState(null);

  const [first, setFirst] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [partsDialogVisible, setPartsDialogVisible] = useState(false);
  const [addressDialogVisible, setAddressDialogVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedStatusRequest, setSelectedStatusRequest] = useState(null);
  const [visibleItems, setVisibleItems] = useState(false);
  const [selectedRepairItem, setSelectedRepairItem] = useState(null);
  // (A) <-- เพิ่ม state สำหรับ Search
  const [search, setSearch] = useState("");
  const [editDefaultPriceVisible, setEditDefaultPriceVisible] = useState(false);
  const [newDefaultPrice, setNewDefaultPrice] = useState(null);

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
    const validValue = value < 0 ? 0 : value;
    setSelectedParts((prev) => ({ ...prev, [productId]: validValue }));
  };

  const viewRepairItem = (repair) => {
    setSelectedRepairItem(repair);
    setVisibleItems(true);
  };

  const unitMap = {
    แผ่นประตูม้วน: "แผ่น",
    เสารางประตูม้วน: "เส้น",
    แกนเพลาประตูม้วน: "แท่ง",
    กล่องเก็บม้วนประตู: "กล่อง",
    ตัวล็อกประตูม้วน: "ตัว",
    กุญแจประตูม้วน: "ชุด",
    รอกโซ่ประตูม้วน: "ชุด",
    ชุดเฟืองโซ่ประตูม้วน: "ชุด",
    โซ่ประตูม้วน: "เมตร",
    ตัวล็อคโซ่สาว: "ตัว",
    ชุดมอเตอร์ประตูม้วน: "ชุด",
    สวิตช์กดควบคุม: "ชุด",
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
    { label: "รอการยืนยัน", value: "pending" },
    { label: "ได้รับการยืนยัน", value: "confirm" },
    { label: "เสร็จแล้ว", value: "complete" },
    { label: "ยกเลิก", value: "cancle" },
  ];

  useEffect(() => {
    fetchRepairRequests();
    fetchParts();
  }, []);

  // เรียก filterRepairs() ทุกครั้งที่ repairRequests, activeTab หรือ search มีการเปลี่ยนแปลง
  useEffect(() => {
    filterRepairs();
  }, [repairRequests, activeTab, search]);

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

  const filterRepairs = () => {
    const searchText = search.trim().toLowerCase();

    // 1) กรองตามสถานะ (tab)
    let filtered = [];
    if (activeTab === "ทั้งหมด") {
      filtered = [...repairRequests];
    } else {
      filtered = repairRequests.filter((r) => r.status === activeTab);
    }

    // 2) กรองตามข้อความ search
    if (searchText) {
      filtered = filtered.filter((r) => {
        const fname = (r.user?.firstname || "").toLowerCase();
        const lname = (r.user?.lastname || "").toLowerCase();
        const phone = (r.user?.phone || "").toLowerCase();
        const serviceType = (r.service_type || "").toLowerCase();
        const problemDesc = (r.problem_description || "").toLowerCase();
        const dateStr = moment(r.request_date)
          .format("DD/MM/YYYY HH:mm")
          .toLowerCase();

        return (
          fname.includes(searchText) ||
          lname.includes(searchText) ||
          phone.includes(searchText) ||
          serviceType.includes(searchText) ||
          problemDesc.includes(searchText) ||
          dateStr.includes(searchText)
        );
      });
    }

    setFilteredRepairs(filtered);
  };

  const onPageChange = (event) => {
    setFirst(event.first);
    setRowsPerPage(event.rows);
  };

  const performStatusUpdate = async (repairId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/repair-requests/${repairId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "complete" && repairPrice !== null && !isNaN(repairPrice)
            ? { repair_price: parseFloat(repairPrice) }
            : {})
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedItem = data.data;
        const newList = repairRequests.map((req) =>
          req.id === updatedItem.id ? updatedItem : req
        );
        setRepairRequests(newList);
      } else {
        console.error("Update failed:", data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };


  const updateRepairStatus = (repairId, newStatus) => {
    if (newStatus === "complete" || newStatus === "cancle") {
      setSelectedStatusRequest({ repairId, newStatus });
      setConfirmDialogVisible(true);
      setRepairPrice(null);
    } else {
      performStatusUpdate(repairId, newStatus);
    }
  };

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
        severity = "success"; // สีเขียว
        statusText = "เสร็จแล้ว";
        break;
      case "cancle":
        severity = "danger"; // สีแดง
        statusText = "ยกเลิก";
        break;
      default:
        severity = "secondary"; // สีเทา
        statusText = "ไม่ระบุ";
    }

    return <Tag value={statusText} severity={severity} />;
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
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">การจัดการคำขอแจ้งซ่อม</h1>

        {/* (A) Search Box ตำแหน่งชิดขวา */}
        <div className="flex ml-auto items-center gap-2 mt-3" style={{ width: '100%', maxWidth: '500px', height: "38px" }}>
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search pl-3 text-gray-500" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาข้อมูลส่งซ่อม"
              className="w-full pl-8"
            />
          </span>
          <Button
            label="แก้ไขราคาซ่อมเริ่มต้น"
            icon="pi pi-pencil"
            className="p-button-sm px-3 text-sm h-full py-0"
            style={{
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              minWidth: '180px'
            }}
            onClick={() => setEditDefaultPriceVisible(true)}
          />

        </div>
      </div>

      <Card>
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveTab(e.value.value);
            setActiveIndex(
              items.findIndex((tab) => tab.value === e.value.value)
            );
          }}
        />

        <DataTable
          value={filteredRepairs.filter(
            (req) => req.status !== "complete" && req.status !== "cancle"
          )}
          emptyMessage="ไม่มีรายการแจ้งซ่อม"
          paginator
          rows={rowsPerPage}
          first={first}
          onPage={onPageChange}
          style={{ marginTop: "1rem" }}
          sortField="request_date"
          sortOrder={-1}
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
            header="วันที่แจ้งซ่อม"
            body={dateTemplate}
            sortable
          />
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
          <Column
            field="repair_price"
            header="ราคาซ่อม (บาท)"
            body={(rowData) =>
              rowData.repair_price !== null
                ? Number(rowData.repair_price).toLocaleString("th-TH")
                : "-"
            }
          />
          <Column
            field="status"
            body={statusTemplate}
            header="สถานะ"
            sortable
          />
          <Column body={statusEditor} header="เปลี่ยนสถานะ" />
        </DataTable>
      </Card>

      {/* Dialog: ที่อยู่ */}
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

      {/* Dialog: เลือกอะไหล่ */}
      <Dialog
        header="เลือกอะไหล่ที่ใช้ในการซ่อม"
        visible={partsDialogVisible}
        className="w-auto"
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
                  src={`${process.env.REACT_APP_API}${rowData.images[0]}`}
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
          <Column
            header="สต็อกที่มี"
            body={(rowData) =>
              `${rowData.stock_quantity.toLocaleString()} ${unitMap[rowData.category] || "ชุด"
              }`
            }
          />
          <Column
            header="จำนวนที่ใช้"
            body={(rowData) => (
              <div className="flex">
                <InputNumber
                  value={selectedParts[rowData.id] || 0}
                  onValueChange={(e) =>
                    handleQuantityChange(rowData.id, e.value)
                  }
                  min={0}
                  max={rowData.stock_quantity}
                />
                <span className="p-inputgroup-addon">
                  {unitMap[rowData.category] || "ชุด"}
                </span>
              </div>
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
      <Dialog
        header="ยืนยันการเปลี่ยนสถานะ"
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        footer={
          <div>
            <Button
              label="ยกเลิก"
              className="p-button-text"
              onClick={() => setConfirmDialogVisible(false)}
            />
            <Button
              label="ยืนยัน"
              className="p-button-primary"
              onClick={() => {
                performStatusUpdate(
                  selectedStatusRequest.repairId,
                  selectedStatusRequest.newStatus
                );
                setConfirmDialogVisible(false);
              }}
            />
          </div>
        }
      >
        <p>
          คุณแน่ใจว่าต้องการเปลี่ยนสถานะเป็น "
          {selectedStatusRequest?.newStatus === "complete"
            ? "เสร็จแล้ว"
            : "ยกเลิก"}
          " หรือไม่?
        </p>
        {selectedStatusRequest?.newStatus === "complete" && (
          <div className="mt-4">
            <label htmlFor="repairPrice" className="block mb-2 font-semibold">
              ราคาซ่อม (บาท)
            </label>
            <InputNumber
              id="repairPrice"
              value={repairPrice}
              onValueChange={(e) => setRepairPrice(e.value)}
              mode="currency"
              currency="THB"
              locale="th-TH"
              className="w-full"
            />
          </div>
        )}
      </Dialog>
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
        header="แก้ไขราคาซ่อมเริ่มต้น"
        visible={editDefaultPriceVisible}
        onHide={() => setEditDefaultPriceVisible(false)}
        footer={
          <>
            <Button label="ยกเลิก" onClick={() => setEditDefaultPriceVisible(false)} className="p-button-text" />
            <Button
              label="บันทึก"
              onClick={async () => {
                try {
                  const res = await fetch(`${process.env.REACT_APP_API}/api/repair-requests/default-repair-price`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ value: newDefaultPrice }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    alert("อัปเดตราคาสำเร็จ");
                    setEditDefaultPriceVisible(false);
                  } else {
                    alert(data.message || "เกิดข้อผิดพลาด");
                  }
                } catch (err) {
                  console.error(err);
                  alert("ไม่สามารถอัปเดตได้");
                }
              }}
            />
          </>
        }
      >
        <InputNumber
          value={newDefaultPrice}
          onValueChange={(e) => setNewDefaultPrice(e.value)}
          mode="currency"
          currency="THB"
          locale="th-TH"
          placeholder="กรอกราคาใหม่"
        />
      </Dialog>


    </div>
  );
};

export default Managerepairrequests;
