import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import axios from "axios";

const ProductHistory = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [visibleAddress, setVisibleAddress] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 Orders from API:", response.data.data);
      setOrders(response.data.data.filter(order => order.status === "complete" || order.status === "cancel"));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("ต้องการลบรายการนี้หรือไม่?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const statusTemplate = (rowData) => {
    const statusMapping = {
      complete: { label: "สำเร็จ", severity: "success" },
      cancel: { label: "ยกเลิก", severity: "danger" },
    };
  
    const status = statusMapping[rowData.status] || { label: "ไม่ทราบ", severity: "warning" };
  
    return <Tag value={status.label} severity={status.severity} />;
  };

  const viewOrderItems = (order) => {
    if (order.order_items && order.order_items.length > 0) {
      setOrderItems(order.order_items);
      setVisibleItems(true);
    } else {
      alert("ไม่มีรายการสินค้า");
    }
  };

  const viewAddressDetails = (order) => {
    if (order.address) {
      setSelectedAddress(order.address);
      setVisibleAddress(true);
    } else {
      alert("ไม่มีข้อมูลที่อยู่");
    }
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

  return (
    <div>
      <DataTable value={orders} dataKey="id" paginator rows={10}>
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
        <Column
          header="ลบ"
          body={(rowData) => (
            <Button
              label="ลบ"
              icon="pi pi-trash"
              className="p-button-danger p-button-sm"
              onClick={() => deleteOrder(rowData.id)}
            />
          )}
        />
      </DataTable>

      <Dialog
        header="รายการสินค้า"
        visible={visibleItems}
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
    </div>
  );
};

export default ProductHistory;