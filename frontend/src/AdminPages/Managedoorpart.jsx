import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primeflex/primeflex.css";

const unitMap = {
  "แผ่นประตูม้วน": "แผ่น",
  "เสารางประตูม้วน": "เส้น",
  "แกนเพลาประตูม้วน": "แท่ง",
  "กล่องเก็บม้วนประตู": "กล่อง",
  "ตัวล็อกประตูม้วน": "ตัว",
  "กุญแจประตูม้วน": "ชุด",
  "รอกโซ่ประตูม้วน": "ชุด",
  "ชุดเฟืองโซ่ประตูม้วน": "ชุด",
  "โซ่ประตูม้วน": "เมตร",
  "ตัวล็อคโซ่สาว": "ตัว",
  "ชุดมอเตอร์ประตูม้วน": "ชุด",
  "สวิตช์กดควบคุม": "ชุด",
  manual_rolling_shutter: "ชุด",
  chain_electric_shutter: "ชุด",
  electric_rolling_shutter: "ชุด",
};

const categoryMapping = {
  manual_rolling_shutter: "ประตูม้วนแบบมือดึง",
  chain_electric_shutter: "ประตูม้วนแบบรอกโซ่",
  electric_rolling_shutter: "ประตูม้วนแบบไฟฟ้า",
};

const api = axios.create({ baseURL: process.env.REACT_APP_API });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Managedoorpart() {
  // States
  const [nonPartProducts, setNonPartProducts] = useState([]);
  const [availableParts, setAvailableParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const toast = useRef(null);

  // Pagination (main & dialog)
  const [firstMain, setFirstMain] = useState(0);
  const [rowsMain, setRowsMain] = useState(10);
  const [firstDialog, setFirstDialog] = useState(0);
  const [rowsDialog, setRowsDialog] = useState(10);

  // Dropdown + Realtime search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("all");

  // โหลดรายการสินค้า (ไม่ใช่อะไหล่)
  useEffect(() => {
    api.get("/api/products")
      .then((res) => {
        const nonParts = res.data.filter((p) => !p.is_part);
        setNonPartProducts(nonParts);
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: err.message });
      });
  }, []);

  // โหลดรายการอะไหล่
  useEffect(() => {
    api.get("/api/products/parts")
      .then((res) => {
        setAvailableParts(res.data);
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: err.message });
      });
  }, []);

  // สร้างตัวเลือกใน Dropdown: "ทั้งหมด" + ชื่อสินค้า (ไม่ซ้ำ)
  const productDropdownOptions = [
    { label: "ทั้งหมด", value: "all" },
    ...Array.from(new Set(nonPartProducts.map((p) => p.name))).map((name) => ({
      label: name,
      value: name,
    })),
  ];

  // ฟิลเตอร์สินค้าตาม dropdown + search
  const filteredProducts = nonPartProducts.filter((product) => {
    const matchesDropdown = selectedProduct === "all" || product.name === selectedProduct;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDropdown && matchesSearch;
  });

  // เปิด Dialog และโหลด BOM เก่า
  const openDialog = async (product) => {
    setActiveProduct(product);
    try {
      const res = await api.get(`/api/products/${product.id}/bom`);
      setSelectedParts(res.data || []);
    } catch (error) {
      setSelectedParts([]);
    }
    setShowDialog(true);
  };

  // ปิด Dialog
  const closeDialog = () => {
    setShowDialog(false);
    setActiveProduct(null);
    setSelectedParts([]);
  };

  // เลือก/ยกเลิกเลือกอะไหล่
  const handleCheckboxChange = (part, event) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedParts((prev) => [
        ...prev,
        {
          partId: part.id,
          quantity: 1,
          unit: unitMap[part.category] || "ชุด",
          name: part.name,
          category: part.category,
        },
      ]);
    } else {
      setSelectedParts((prev) => prev.filter((item) => item.partId !== part.id));
    }
  };

  // เปลี่ยนจำนวนอะไหล่
  const handleQuantityChange = (partId, e) => {
    const value = e.value;
    setSelectedParts((prev) =>
      prev.map((item) => (item.partId === partId ? { ...item, quantity: value } : item))
    );
  };

  // บันทึก BOM
  const saveBOM = async () => {
    if (!activeProduct) return;
    try {
      await api.post(`/api/products/${activeProduct.id}/bom`, { bomItems: selectedParts });
      toast.current.show({
        severity: "success",
        summary: "บันทึก BOM สำเร็จ",
      });
      closeDialog();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: error.message,
      });
    }
  };

  // Template: ตารางหลัก
  const mainImageBodyTemplate = (rowData) => {
    return rowData.images && rowData.images.length > 0 ? (
      <img
        src={`${process.env.REACT_APP_API}${rowData.images[0]}`}
        alt={rowData.name}
        style={{ width: "80px", height: "80px", objectFit: "cover" }}
      />
    ) : (
      <span>No Image</span>
    );
  };
  const categoryBodyTemplate = (rowData) => {
    return categoryMapping[rowData.category] || rowData.category;
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        label="จัดการอะไหล่"
        icon="pi pi-cog"
        className="p-button-info"
        onClick={() => openDialog(rowData)}
      />
    );
  };

  // Template: Dialog Header
  const dialogHeader = (
    <div className="p-d-flex p-ai-center">
      {activeProduct?.images?.length > 0 && (
        <img
          src={`${process.env.REACT_APP_API}${activeProduct.images[0]}`}
          alt={activeProduct.name}
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            marginRight: "1rem",
          }}
        />
      )}
      <span className="text-xl font-bold">{activeProduct?.name}</span>
    </div>
  );

  // Template: ตารางใน Dialog
  const imageBodyTemplate = (rowData) => {
    return rowData.images && rowData.images.length > 0 ? (
      <img
        src={`${process.env.REACT_APP_API}${rowData.images[0]}`}
        alt={rowData.name}
        style={{ width: "80px", height: "80px", objectFit: "cover" }}
      />
    ) : (
      <span>No Image</span>
    );
  };
  const nameBodyTemplate = (rowData) => rowData.name;
  const dialogCategoryBodyTemplate = (rowData) => rowData.category || "-";
  const dialogUnitBodyTemplate = (rowData) => unitMap[rowData.category] || "-";
  const selectBodyTemplate = (rowData) => {
    const isSelected = selectedParts.some((item) => item.partId === rowData.id);
    return (
      <Checkbox
        inputId={`part_${rowData.id}`}
        checked={isSelected}
        onChange={(e) => handleCheckboxChange(rowData, e)}
        style={{ transform: "scale(1.3)" }}
      />
    );
  };
  const quantityBodyTemplate = (rowData) => {
    const isSelected = selectedParts.some((item) => item.partId === rowData.id);
    if (!isSelected) return "-";
    const selectedItem = selectedParts.find((item) => item.partId === rowData.id);
    return (
      <InputNumber
        value={selectedItem ? selectedItem.quantity : 1}
        onValueChange={(e) => handleQuantityChange(rowData.id, e)}
        mode="decimal"
        min={1}
        style={{ width: "80px" }}
      />
    );
  };

  // DataTable: สินค้าไม่ใช่อะไหล่ (ใช้ filteredProducts)
  const mainTable = (
    <DataTable
      value={filteredProducts}
      dataKey="id"
      responsiveLayout="stack"
      paginator
      rows={rowsMain}
      first={firstMain}
      onPage={(e) => setFirstMain(e.first)}
      className="p-mb-4"
    >
      <Column
        header="รูปสินค้า"
        body={mainImageBodyTemplate}
        style={{ textAlign: "center", width: "100px" }}
      />
      <Column field="name" header="ชื่อสินค้า" sortable />
      <Column header="ประเภท" body={categoryBodyTemplate} sortable />
      <Column field="description" header="รายละเอียด" />
      <Column header="การจัดการ" body={actionBodyTemplate} />
    </DataTable>
  );

  // DataTable: อะไหล่ (ใน Dialog)
  const dialogTable = (
    <DataTable
      value={availableParts}
      responsiveLayout="stack"
      paginator
      rows={rowsDialog}
      first={firstDialog}
      onPage={(e) => setFirstDialog(e.first)}
      className="p-mt-3"
    >
      <Column header="รูปสินค้า" body={imageBodyTemplate} style={{ width: "100px" }} />
      <Column field="name" header="ชื่อสินค้า" body={nameBodyTemplate} />
      <Column
        header="ประเภท"
        body={dialogCategoryBodyTemplate}
        style={{ width: "150px" }}
      />
      <Column
        header="เลือก"
        body={selectBodyTemplate}
        style={{ width: "100px", textAlign: "center" }}
      />
      <Column
        header="จำนวน"
        body={quantityBodyTemplate}
        style={{ width: "150px" }}
      />
      <Column
        header="หน่วย"
        body={dialogUnitBodyTemplate}
        style={{ width: "100px", textAlign: "center" }}
      />
    </DataTable>
  );

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h1 className="text-2xl font-bold mb-4">
        จัดการอะไหล่ของแต่ละประตูม้วน
      </h1>

      {/* สองคอมโพเนนต์เรียงแนวนอน: Dropdown และ InputText */}
      <div className="flex gap-2 mb-4">
        <div style={{ width: "300px" }}>
          <Dropdown
            value={selectedProduct}
            options={productDropdownOptions}
            onChange={(e) => setSelectedProduct(e.value)}
            placeholder="กรองสินค้าตามชื่อ"
            className="w-full"
          />
        </div>
        <div style={{ width: "300px" }}>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาด้วยชื่อสินค้า"
            className="w-full"
          />
        </div>
      </div>

      {mainTable}

      <Dialog
        header={dialogHeader}
        visible={showDialog}
        style={{ width: "60vw" }}
        modal
        footer={
          <div className="p-d-flex p-jc-end">
            <Button
              label="ยกเลิก"
              icon="pi pi-times"
              className="p-button-text"
              onClick={closeDialog}
            />
            <Button
              label="บันทึก BOM"
              icon="pi pi-check"
              className="p-button-success p-ml-2"
              onClick={saveBOM}
            />
          </div>
        }
        onHide={closeDialog}
      >
        {dialogTable}
      </Dialog>
    </div>
  );
}
