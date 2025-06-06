import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";
import OrderSummaryDialog from "../../Component/OrderSummaryDialog";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [visibleAddress, setVisibleAddress] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // state สำหรับ OrderSummaryDialog
  const [visibleSummary, setVisibleSummary] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bomDetailsMap, setBomDetailsMap] = useState({});
  const viewOrderSummary = async (order) => {
    setSelectedOrder(order);
    await fetchBOMForOrder(order);
    setVisibleSummary(true);
  };

  const fetchBOMForOrder = async (order) => {
    const newBOMMap = {};
    // วนลูปทุก order item ถ้า is_part = false ให้ดึงข้อมูล BOM ของ product นั้น ๆ
    for (const item of order.order_items) {
      if (!item.product.is_part) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/products/${item.product.id}/bom`
          );
          // ใช้ order item id เป็น key
          newBOMMap[item.id] = res.data;
        } catch (err) {
          console.error("Error loading BOM for product:", item.product.id, err);
          // กำหนดเป็น [] หากไม่มี BOM หรือโหลดไม่สำเร็จ
          newBOMMap[item.id] = [];
        }
      }
    }
    setBomDetailsMap(newBOMMap);
  };

  const items = [
    { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
    { label: "รอการยืนยัน", value: "pending", icon: "pi pi-clock" },
    {
      label: "ได้รับการยืนยันแล้ว",
      value: "confirm",
      icon: "pi pi-check-circle",
    },
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
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/orders/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === "ทั้งหมด") return orders; // แสดงคำสั่งซื้อทั้งหมด
    console.log(
      "Filtered Orders: ",
      orders.filter((order) => order.status === "cancle")
    );
    return orders.filter((order) => order.status === status);
  };

  // แสดงสีของสถานะออเดอร์
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

  // ฟังก์ชันแสดงรูปภาพสินค้า
  const ImageTemplate = (rowData) => {
    const images = rowData.rowData.product?.images || [];

    return (
      <div style={{ display: "flex", gap: "5px" }}>
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
                style={{ borderRadius: "5px" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/50";
                }}
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
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {items.map((tab, index) => (
          <TabPanel
            key={index}
            header={
              <div>
                <i className={tab.icon} style={{ marginRight: "5px" }}></i>
                {tab.label}
              </div>
            }
          >
            <DataTable
              value={filterOrdersByStatus(tab.value)}
              dataKey="id"
              paginator
              rows={9}
            >
              <Column header="ID" body={(rowData) => rowData.user?.id || "-"} />
              <Column
                header="ชื่อ"
                body={(rowData) => rowData.user?.firstname || "-"}
              />
              <Column
                header="นามสกุล"
                body={(rowData) => rowData.user?.lastname || "-"}
              />
              <Column
                header="เบอร์โทรศัพท์"
                body={(rowData) => rowData.user?.phone || "-"}
              />
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
              <Column
                header="ยอดรวมทั้งหมด"
                body={(rowData) => {
                  const amount = Number(rowData.total_amount) || 0;
                  return `${amount.toLocaleString("en-US")} บาท`;
                }}
              />
              <Column header="สถานะ" body={statusTemplate} />
              <Column
                header="สรุปออเดอร์"
                body={(rowData) => (
                  <Button
                    label="ดูสรุป"
                    icon="pi pi-print"
                    className="p-button-sm"
                    onClick={() => viewOrderSummary(rowData)}
                  />
                )}
              />
            </DataTable>
          </TabPanel>
        ))}
      </TabView>

      <Dialog
        header="รายการสินค้า"
        visible={visibleItems}
        draggable={false}
        style={{ width: "80vw" }}
        onHide={() => setVisibleItems(false)}
      >
        <DataTable value={orderItems} responsiveLayout="scroll">
          <Column field="product.name" header="ชื่อสินค้า" />
          <Column
            header="รูปสินค้า"
            body={(rowData) => <ImageTemplate rowData={rowData} />}
          />
          <Column field="color" header="สี" />
          <Column field="width" header="กว้าง (ม.)" />
          <Column field="length" header="ยาว (ม.)" />
          <Column field="thickness" header="ความหนา" />
          <Column field="installOption" header="ตัวเลือกติดตั้ง" />
          <Column field="quantity" header="จำนวน" />
          <Column field="price" header="ราคา/ต่อชิ้น (บาท)" />
        </DataTable>
      </Dialog>

      <Dialog
        header="รายละเอียดที่อยู่"
        visible={visibleAddress}
        style={{ width: "50vw" }}
        onHide={() => setVisibleAddress(false)}
      >
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

      {selectedOrder && (
        <OrderSummaryDialog
          visible={visibleSummary}
          onHide={() => setVisibleSummary(false)}
          selectedOrder={selectedOrder}
          bomDetailsMap={bomDetailsMap}
        />
      )}
    </div>
  );
};

export default OrderPage;
