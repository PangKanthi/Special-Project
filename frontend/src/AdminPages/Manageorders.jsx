import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";
import { fetchDoorConfig } from "../services/doorConfigService";
import { calculateTotalDoorPrice } from "../utils/index";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [visibleAddress, setVisibleAddress] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fetchedDoorConfig, setFetchedDoorConfig] = useState(null);

  useEffect(() => {
    const loadDoorConfig = async () => {
      try {
        const data = await fetchDoorConfig();
        setFetchedDoorConfig(data);
      } catch {}
    };
    loadDoorConfig();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.data);
    } catch {}
  };

  const recalcPriceWithRowDataAsync = async (rowData) => {
    const cat = rowData.product?.category || "";
    if (rowData.color === "default") return rowData.price;
    const widthNum = parseFloat(rowData.width) || 0;
    const heightNum = parseFloat(rowData.length) || 0;
    const thickStr = rowData.thickness || "";
    const { result, errorMessage } = await calculateTotalDoorPrice(
      cat,
      widthNum,
      heightNum,
      thickStr
    );
    if (errorMessage) return rowData.price;
    return result != null ? result : rowData.price;
  };

  const saveRowEdit = async (newData, index) => {
    const newPrice = await recalcPriceWithRowDataAsync(newData);
    const updatedData = { ...newData, price: newPrice };
    const newItems = [...orderItems];
    newItems[index] = updatedData;
    setOrderItems(newItems);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API}/api/orders/order-items`,
        {
          orderItemId: updatedData.id,
          productId: updatedData.product.id,
          quantity: updatedData.quantity,
          price: updatedData.price,
          color: updatedData.color || null,
          width: updatedData.width || 0,
          length: updatedData.length || 0,
          thickness: updatedData.thickness || "",
          installOption: updatedData.installOption || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {}
  };

  const onRowEditComplete = async (e) => {
    const { newData, index } = e;
    await saveRowEdit(newData, index);
    await fetchOrders();
  };

  const filterOrdersByStatus = (status) => {
    if (status === "ทั้งหมด") {
      return orders.filter((o) => o.status !== "complete" && o.status !== "cancel");
    }
    return orders.filter((o) => o.status === status);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API}/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {}
  };

  const statusTemplate = (rowData) => {
    let severity = "";
    let statusText = "";
    switch (rowData.status) {
      case "pending":
        severity = "warning";
        statusText = "รอการยืนยัน";
        break;
      case "confirm":
        severity = "info";
        statusText = "ได้รับการยืนยันแล้ว";
        break;
      case "complete":
        severity = "success";
        statusText = "เสร็จแล้ว";
        break;
      case "cancel":
        severity = "danger";
        statusText = "ยกเลิก";
        break;
      default:
        severity = "secondary";
        statusText = "ไม่ระบุ";
    }
    return <Tag value={statusText} severity={severity} />;
  };

  const ImageTemplate = (rowData) => {
    const images = rowData.rowData.product?.images || [];
    return (
      <div style={{ display: "flex", gap: "5px" }}>
        {images.length > 0 ? (
          images.map((img, i) => {
            const imageUrl = `${process.env.REACT_APP_API}${img}`;
            return (
              <img
                key={i}
                src={imageUrl}
                alt="product-img"
                width="50"
                height="50"
                style={{ borderRadius: "5px" }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
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

  const colorEditor = (options) => {
    if (options.rowData.color === "default") return null;
    const availableColors = options.rowData.product?.colors || [];
    const colorOptions = availableColors.map((c) => ({ label: c, value: c }));
    return (
      <Dropdown
        value={options.value}
        options={colorOptions}
        onChange={(e) => options.editorCallback(e.value)}
        style={{ width: "100%" }}
      />
    );
  };

  const installOptionEditor = (options) => {
    if (options.rowData.color === "default") return null;
    const installOpts = [
      { label: "ติดตั้ง", value: "ติดตั้ง" },
      { label: "ไม่ติดตั้ง", value: "ไม่ติดตั้ง" },
    ];
    return (
      <Dropdown
        value={options.value}
        options={installOpts}
        onChange={(e) => options.editorCallback(e.value)}
        style={{ width: "100%" }}
      />
    );
  };

  const thicknessEditor = (options) => {
    if (options.rowData.color === "default") return null;
    const category = options.rowData.product?.category;
    if (!fetchedDoorConfig || !fetchedDoorConfig[category]) {
      return (
        <InputText
          value={options.value || ""}
          onChange={(e) => options.editorCallback(e.target.value)}
        />
      );
    }
    const priceTiers = fetchedDoorConfig[category].priceTiers || [];
    const thicknessOptions = priceTiers.map((tier) => ({
      label: tier.thickness,
      value: tier.thickness,
    }));
    return (
      <Dropdown
        value={options.value}
        options={thicknessOptions}
        onChange={(e) => options.editorCallback(e.value)}
        style={{ width: "100%" }}
      />
    );
  };

  const dimensionEditor = (options) => {
    if (options.rowData.color === "default") return null;
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="decimal"
        minFractionDigits={0}
        maxFractionDigits={2}
        style={{ width: "100%" }}
      />
    );
  };

  const quantityEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        min={1}
        showButtons
        step={1}
        style={{ width: "100%" }}
      />
    );
  };

  const tabItems = [
    { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
    { label: "รอการยืนยัน", value: "pending", icon: "pi pi-clock" },
    { label: "ได้รับการยืนยัน", value: "confirm", icon: "pi pi-check-circle" },
  ];

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Order List</h2>
      <Card>
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
          {tabItems.map((tab, idx) => (
            <TabPanel key={idx} header={<div><i className={tab.icon} style={{ marginRight: "5px" }}></i>{tab.label}</div>}>
              <DataTable value={filterOrdersByStatus(tab.value)} dataKey="id" paginator rows={10}>
                <Column header="ID" body={(rowData) => rowData.user?.id || "-"}/>
                <Column header="ชื่อ" body={(rowData) => rowData.user?.firstname || "-"}/>
                <Column header="นามสกุล" body={(rowData) => rowData.user?.lastname || "-"}/>
                <Column header="เบอร์โทรศัพท์" body={(rowData) => rowData.user?.phone || "-"}/>
                <Column header="ที่อยู่" body={(rowData) => (
                  <Button
                    label="ดูที่อยู่"
                    icon="pi pi-map-marker"
                    className="p-button-sm"
                    onClick={() => viewAddressDetails(rowData)}
                  />
                )}/>
                <Column header="รายการสินค้า" body={(rowData) => (
                  <Button
                    label="ดูสินค้า"
                    icon="pi pi-eye"
                    className="p-button-sm"
                    onClick={() => viewOrderItems(rowData)}
                  />
                )}/>
                <Column field="total_amount" header="ยอดรวมทั้งหมด"/>
                <Column header="สถานะ" body={statusTemplate}/>
                <Column header="เปลี่ยนสถานะ" body={(rowData) => (
                  <Dropdown
                    value={rowData.status}
                    options={[
                      { label: "รอการยืนยัน", value: "pending" },
                      { label: "ได้รับการยืนยัน", value: "confirm" },
                      { label: "เสร็จสิ้น", value: "complete" },
                      { label: "ยกเลิก", value: "cancel" },
                    ]}
                    onChange={(e) => updateStatus(rowData.id, e.value)}
                    style={{ width: "150px" }}
                  />
                )}/>
              </DataTable>
            </TabPanel>
          ))}
        </TabView>
      </Card>
      <Dialog header="รายการสินค้า" visible={visibleItems} style={{ width: "80vw" }} onHide={() => setVisibleItems(false)}>
        <DataTable
          value={orderItems}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete}
          responsiveLayout="scroll"
        >
          <Column field="product.name" header="ชื่อสินค้า"/>
          <Column header="รูปสินค้า" body={(rowData) => <ImageTemplate rowData={rowData}/>}/>
          <Column field="color" header="สี" editor={colorEditor} body={(rowData) => rowData.color === "default" ? "" : (rowData.color || "-")}/>
          <Column field="width" header="กว้าง (ม.)" editor={dimensionEditor} body={(rowData) => rowData.color === "default" ? "" : (rowData.width != null ? rowData.width : "-")}/>
          <Column field="length" header="ยาว (ม.)" editor={dimensionEditor} body={(rowData) => rowData.color === "default" ? "" : (rowData.length != null ? rowData.length : "-")}/>
          <Column field="thickness" header="ความหนา" editor={thicknessEditor} body={(rowData) => rowData.color === "default" ? "" : (rowData.thickness || "-")}/>
          <Column field="installOption" header="ตัวเลือกติดตั้ง" editor={installOptionEditor} body={(rowData) => rowData.color === "default" ? "" : (rowData.installOption || "-")}/>
          <Column field="quantity" header="จำนวน" editor={quantityEditor}/>
          <Column field="price" header="ราคา/ต่อชิ้น (บาท)"/>
          <Column rowEditor headerStyle={{ width: "5rem" }} bodyStyle={{ textAlign: "center" }}/>
        </DataTable>
      </Dialog>
      <Dialog header="รายละเอียดที่อยู่" visible={visibleAddress} style={{ width: "50vw" }} onHide={() => setVisibleAddress(false)}>
        {selectedAddress ? (
          <DataTable value={[selectedAddress]}>
            <Column field="addressLine" header="ที่อยู่"/>
            <Column field="subdistrict" header="ตำบล/แขวง"/>
            <Column field="district" header="อำเภอ/เขต"/>
            <Column field="province" header="จังหวัด"/>
            <Column field="postalCode" header="รหัสไปรษณีย์"/>
          </DataTable>
        ) : (
          <p>ไม่มีข้อมูลที่อยู่</p>
        )}
      </Dialog>
    </div>
  );
};

export default ManageOrders;
