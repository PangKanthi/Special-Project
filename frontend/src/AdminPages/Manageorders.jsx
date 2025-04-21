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
import OrderSummaryDialog from "../Component/OrderSummaryDialog";
import axios from "axios";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [visibleAddress, setVisibleAddress] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrderForStatusUpdate, setSelectedOrderForStatusUpdate] =
    useState(null);
  const [productTierOptions, setProductTierOptions] = useState({});
  const [visibleBOMDialog, setVisibleBOMDialog] = useState(false);
  const [currentBOM, setCurrentBOM] = useState([]);
  const [visibleSummary, setVisibleSummary] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bomDetailsMap, setBomDetailsMap] = useState({});
  const [visibleAddProductDialog, setVisibleAddProductDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const viewOrderSummary = async (order) => {
    if (!order || !order.id) {
      alert("กรุณาเลือกคำสั่งซื้อลูกค้าก่อน");
      return;
    }
    setSelectedOrder(order);
    await fetchBOMForOrder(order);
    setVisibleSummary(true);
  };

  const fetchBOMForOrder = async (order) => {
    const newBOMMap = {};
    for (const item of order.order_items) {
      if (!item.product.is_part) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/products/${item.product.id}/bom`
          );
          newBOMMap[item.id] = res.data;
        } catch (err) {
          console.error("Error loading BOM for product:", item.product.id, err);
          newBOMMap[item.id] = [];
        }
      }
    }
    setBomDetailsMap(newBOMMap);
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchAllPriceTiers = async () => {
      const tiersByProduct = {};
      const productIds = new Set();
      orders.forEach((order) => {
        order.order_items.forEach((item) => {
          if (item.product?.id) {
            productIds.add(item.product.id);
          }
        });
      });
      await Promise.all(
        Array.from(productIds).map(async (productId) => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API}/api/products/${productId}/price-tiers`
            );
            tiersByProduct[productId] = response.data;
          } catch (error) {
            console.error(
              "Error fetching price tiers for product",
              productId,
              error
            );
          }
        })
      );
      setProductTierOptions(tiersByProduct);
    };

    if (orders.length > 0) {
      fetchAllPriceTiers();
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/products`
      );
      const parts = response.data.filter((product) => product.is_part === true);
      setProducts(parts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const refreshCurrentOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedOrder(data.data);
      setOrderItems(data.data.order_items);
    } catch (err) {
      console.error("Error refreshing order:", err);
    }
  };

  const addProductToOrder = async (productId, quantity) => {
    if (!selectedOrder || !selectedOrder.id) {
      alert("กรุณาเลือกคำสั่งซื้อลูกค้าก่อน");
      return;
    }

    if (!productId || quantity <= 0) {
      alert("กรุณาเลือกสินค้าและจำนวนสินค้า");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Sending data to API:", {
        orderId: selectedOrder.id,
        productId,
        quantity,
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/orders/${selectedOrder.id}/add-item`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/orders/${selectedOrder.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderItems(data.data.order_items);
      setVisibleAddProductDialog(false);
      fetchOrders();
    } catch (error) {
      console.error("Error adding product to order:", error);
    }
  };

  const selectOrder = (order) => {
    setSelectedOrder(order);
  };

  const removeProductFromOrder = async (orderItemId) => {
    console.log("Removing product:", orderItemId, "from order:", selectedOrder.id);
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${process.env.REACT_APP_API}/api/orders/${selectedOrder.id}/remove-item/${orderItemId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrderItems(response.data.orderItems);
        setSelectedOrder({ ...selectedOrder, total_amount: response.data.total_amount });
        fetchOrders();
    } catch (error) {
        console.error("Error removing product from order:", error);
    }
};


  const recalcPriceWithRowDataAsync = async (rowData) => {
    const productId = rowData.product?.id;
    if (rowData.color === "default" || !productId) return rowData.price;
    const widthNum = parseFloat(rowData.width) || 0;
    const lengthNum = parseFloat(rowData.length) || 0;
    if (widthNum === 0 || lengthNum === 0) return rowData.price;
    const area = widthNum * lengthNum;

    const tiers = productTierOptions[productId];
    if (!tiers || tiers.length === 0) return rowData.price;

    const matchedTier = tiers.find(
      (tier) =>
        tier.thickness === rowData.thickness &&
        area >= tier.min_area &&
        area <= tier.max_area
    );
    if (!matchedTier) return rowData.price;
    return area * matchedTier.price_per_sqm;
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error saving row edit:", error);
    }
  };

  const onRowEditComplete = async (e) => {
    const { newData, index } = e;
    await saveRowEdit(newData, index);
    await fetchOrders();
  };

  const filterOrdersByStatus = (status) => {
    let filtered = [];
    if (status === "ทั้งหมด") {
      filtered = orders.filter(
        (o) => o.status !== "complete" && o.status !== "cancle"
      );
    } else {
      filtered = orders.filter((o) => o.status === status);
    }
    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((o) => {
        const firstname = o.user?.firstname?.toLowerCase() || "";
        const lastname = o.user?.lastname?.toLowerCase() || "";
        const phone = o.user?.phone?.toLowerCase() || "";
        const orderId = o.id?.toString() || "";
        return (
          firstname.includes(lowerSearch) ||
          lastname.includes(lowerSearch) ||
          phone.includes(lowerSearch) ||
          orderId.includes(lowerSearch)
        );
      });
    }
    return filtered;
  };

  const handleStatusChangeRequest = (order, newStatus) => {
    if (newStatus === "complete" || newStatus === "cancle") {
      setSelectedOrderForStatusUpdate({ order, newStatus });
      setConfirmDialogVisible(true);
    } else {
      updateStatus(order.id, newStatus);
    }
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
    } catch (error) {
      console.error("Error updating order status:", error);
    }
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
      case "cancle":
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
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/50")
                }
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
    setSelectedOrder(order);
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
    const productId = options.rowData.product?.id;
    const tiers = productTierOptions[productId];
    if (!tiers || tiers.length === 0) {
      return (
        <InputText
          value={options.value || ""}
          onChange={(e) => options.editorCallback(e.target.value)}
        />
      );
    }
    const thicknessOptions = Array.from(
      new Set(tiers.map((tier) => tier.thickness))
    ).map((thk) => ({ label: thk, value: thk }));
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
    const handleDecrease = () => {
      if (options.value > 0) {
        options.editorCallback(options.value - 1);
      }
    };

    const handleIncrease = () => {
      if (options.value < 100) {
        options.editorCallback(options.value + 1);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <Button
          label="-"
          className="p-button-secondary"
          onClick={handleDecrease}
          style={{
            width: "35px",
            height: "35px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f0f0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#ffffff")
          }
        />
        <InputText
          value={options.value}
          readOnly
          style={{
            width: "50px",
            height: "35px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <Button
          label="+"
          className="p-button-secondary"
          onClick={handleIncrease}
          style={{
            width: "35px",
            height: "35px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: "20px",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f0f0f0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#ffffff")
          }
        />
      </div>
    );
  };

  const bomButtonTemplate = (rowData) => {
    if (rowData.product && !rowData.product.is_part) {
      return (
        <Button
          label="ตรวจเช็ครายการอะไหล่"
          className="p-button-info p-button-sm"
          onClick={() => handleCheckBOM(rowData)}
        />
      );
    }
    return null;
  };

  const handleCheckBOM = async (orderItem) => {
    if (!orderItem.product || orderItem.product.is_part) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/products/${orderItem.product.id}/bom`
      );
      const bomItems = response.data;
      const bomDetails = bomItems.map((bom) => ({
        partName: bom.part ? bom.part.name : "N/A",
        partImage:
          bom.part && bom.part.images && bom.part.images.length > 0
            ? `${process.env.REACT_APP_API}${bom.part.images[0]}`
            : "https://via.placeholder.com/50",
        requiredQty: orderItem.quantity * bom.quantity,
        remainingQty: bom.part ? bom.part.stock_quantity || 0 : 0,
        unit: bom.unit,
      }));
      setCurrentBOM(bomDetails);
      setVisibleBOMDialog(true);
    } catch (error) {
      console.error("Error fetching BOM items:", error);
    }
  };

  const tabItems = [
    { label: "ทั้งหมด", value: "ทั้งหมด", icon: "pi pi-list" },
    { label: "รอการยืนยัน", value: "pending", icon: "pi pi-clock" },
    { label: "ได้รับการยืนยัน", value: "confirm", icon: "pi pi-check-circle" },
  ];

  return (
    <div className="p-5">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold">การจัดการคำสั่งซื้อ</h1>
        <div className="ml-auto w-72 pt-3">
          <span className="p-input-icon-left w-72">
            <i className="pi pi-search pl-3 text-gray-500" />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาข้อมูลคำสั่งซื้อ"
              className="w-full pl-8"
            />
          </span>
        </div>
      </div>
      <Card>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {tabItems.map((tab, idx) => (
            <TabPanel
              key={idx}
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
                rows={10}
                sortField="id"
                sortOrder={-1}
              >
                <Column field="id" header="หมายเลขคำสั่งซื้อ" sortable />
                <Column
                  header="ชื่อจริง"
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
                  field="total_amount"
                  header="ยอดรวมทั้งหมด"
                  sortable
                  body={(rowData) =>
                    `${Number(rowData.total_amount).toLocaleString()} บาท`
                  }
                />
                <Column
                  field="status"
                  header="สถานะ"
                  body={statusTemplate}
                  sortable
                />
                <Column
                  header="เปลี่ยนสถานะ"
                  body={(rowData) => (
                    <Dropdown
                      value={rowData.status}
                      options={[
                        { label: "รอการยืนยัน", value: "pending" },
                        { label: "ได้รับการยืนยัน", value: "confirm" },
                        { label: "เสร็จสิ้น", value: "complete" },
                        { label: "ยกเลิก", value: "cancle" },
                      ]}
                      onChange={(e) =>
                        handleStatusChangeRequest(rowData, e.value)
                      }
                      style={{ width: "150px" }}
                    />
                  )}
                />
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
      </Card>
      <Dialog
        header="รายการสินค้า"
        visible={visibleItems}
        style={{ width: "80vw" }}
        onHide={() => setVisibleItems(false)}
      >
        <Button
          label="เพิ่มสินค้า"
          icon="pi pi-plus"
          className="p-button-success p-button-sm"
          onClick={() => setVisibleAddProductDialog(true)}
        />
        <DataTable
          value={orderItems}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onRowEditComplete}
        >
          <Column field="product.name" header="ชื่อสินค้า" />
          <Column
            header="รูปสินค้า"
            body={(rowData) => <ImageTemplate rowData={rowData} />}
          />
          <Column
            field="color"
            header="สี"
            editor={colorEditor}
            body={(rowData) =>
              rowData.color === "default" ? "-" : rowData.color || "-"
            }
          />
          <Column
            field="width"
            header="กว้าง (ม.)"
            editor={dimensionEditor}
            body={(rowData) =>
              rowData.color === "default"
                ? "-"
                : rowData.width != null
                ? rowData.width
                : "-"
            }
          />
          <Column
            field="length"
            header="ยาว (ม.)"
            editor={dimensionEditor}
            body={(rowData) =>
              rowData.color === "default"
                ? "-"
                : rowData.length != null
                ? rowData.length
                : "-"
            }
          />
          <Column
            field="thickness"
            header="ความหนา"
            editor={thicknessEditor}
            body={(rowData) =>
              rowData.color === "default" ? "-" : rowData.thickness || "-"
            }
          />
          <Column
            field="installOption"
            header="ตัวเลือกติดตั้ง"
            editor={installOptionEditor}
            body={(rowData) =>
              rowData.color === "default" ? "-" : rowData.installOption || "-"
            }
          />
          <Column field="quantity" header="จำนวน" editor={quantityEditor} />
          <Column field="price" header="ราคา/ต่อชิ้น (บาท)" />
          <Column header="ตรวจเช็ครายการอะไหล่" body={bomButtonTemplate} />
          <Column
            rowEditor
            headerStyle={{ width: "5rem" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <div className="flex gap-2">
                <Button
                  icon="pi pi-trash"
                  className="p-button-sm p-button-danger"
                  onClick={() => removeProductFromOrder(rowData.id)}
                />
              </div>
            )}
          />
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
                if (selectedOrderForStatusUpdate) {
                  const { order, newStatus } = selectedOrderForStatusUpdate;
                  updateStatus(order.id, newStatus);
                  setConfirmDialogVisible(false);
                }
              }}
            />
          </div>
        }
      >
        <p>
          คุณแน่ใจว่าต้องการเปลี่ยนสถานะเป็น "
          {selectedOrderForStatusUpdate?.newStatus === "complete"
            ? "เสร็จแล้ว"
            : "ยกเลิก"}
          " หรือไม่?
        </p>
      </Dialog>
      <Dialog
        header="รายการอะไหล่ที่ใช้"
        visible={visibleBOMDialog}
        style={{ width: "60vw" }}
        onHide={() => setVisibleBOMDialog(false)}
      >
        <DataTable value={currentBOM} dataKey="partName">
          <Column
            header="รูปอะไหล่"
            body={(data) => (
              <img
                src={data.partImage}
                alt={data.partName}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            )}
            style={{ width: "100px", textAlign: "center" }}
          />
          <Column field="partName" header="ชื่ออะไหล่" />
          <Column field="requiredQty" header="จำนวนที่ใช้" />
          <Column field="remainingQty" header="จำนวนคงเหลือ" />
          <Column field="unit" header="หน่วย" />
        </DataTable>
      </Dialog>

      <Dialog
        header="เพิ่มอะไหล่ไปยังออเดอร์"
        visible={visibleAddProductDialog}
        style={{ width: "50vw" }}
        onHide={() => setVisibleAddProductDialog(false)}
      >
        <Dropdown
          options={products.map((product) => ({
            label: product.name,
            value: product.id,
          }))}
          placeholder="เลือกอะไหล่"
          value={selectedProduct}
          onChange={(e) => {
            console.log("Product selected:", e.value);
            setSelectedProduct(e.value);
          }}
          style={{ width: "100%" }}
        />
        <InputNumber
          value={quantity}
          onValueChange={(e) => setQuantity(e.value)}
          min={1}
          style={{ width: "100%", marginTop: "1rem" }}
          placeholder="จำนวน"
        />
        <Button
          label="เพิ่มอะไหล่"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => {
            console.log("Selected product id before adding:", selectedProduct);
            if (selectedProduct && quantity > 0) {
              addProductToOrder(selectedProduct, quantity);
            } else {
              alert("กรุณาเลือกสินค้าและจำนวนสินค้า");
            }
          }}
        />
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

export default ManageOrders;
