import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";

const api = axios.create({ baseURL: process.env.REACT_APP_API });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function ManageProductPriceTier() {
  const [products, setProducts] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editing, setEditing] = useState({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddThicknessDialog, setShowAddThicknessDialog] = useState(false);
  const [newTier, setNewTier] = useState({
    thickness: "",
    min_area: 0,
    max_area: 0,
    price_per_sqm: 0,
    productId: null,
  });
  const [newThickness, setNewThickness] = useState("");
  const toast = useRef(null);
  const [filterProductId, setFilterProductId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const onPage = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  useEffect(() => {
    loadProductsAndTiers();
  }, []);

  const loadProductsAndTiers = async () => {
    try {
      const res = await api.get("/api/products");
      const filtered = res.data.filter((p) => p.is_part === false);
      setProducts(filtered);

      const allTiers = [];
      for (const p of filtered) {
        const resTier = await api.get(`/api/products/${p.id}/price-tiers`);
        const tiersWithProduct = resTier.data.map((t) => ({
          ...t,
          productId: p.id,
          productName: p.name,
        }));
        allTiers.push(...tiersWithProduct);
      }
      setTiers(allTiers);
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const priceEditor = (opts, field) => {
    const r = editing[opts.rowData.id] || opts.rowData;
    return (
      <InputNumber
        value={r[field]}
        onValueChange={(e) =>
          setEditing((p) => ({
            ...p,
            [opts.rowData.id]: { ...r, [field]: e.value },
          }))
        }
      />
    );
  };

  const textEditor = (opts, field) => {
    const r = editing[opts.rowData.id] || opts.rowData;
    return (
      <InputText
        value={r[field]}
        onChange={(e) =>
          setEditing((p) => ({
            ...p,
            [opts.rowData.id]: { ...r, [field]: e.target.value },
          }))
        }
      />
    );
  };

  const onSaveRow = async ({ data }) => {
    const upd = editing[data.id];
    try {
      const { thickness, min_area, max_area, price_per_sqm } = upd;
      await api.patch(`/api/products/price-tiers/${data.id}`, {
        thickness,
        min_area,
        max_area,
        price_per_sqm,
      });
      setEditing((p) => {
        const c = { ...p };
        delete c[data.id];
        return c;
      });
      loadProductsAndTiers();
      toast.current.show({ severity: "success", summary: "บันทึกแล้ว" });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const onDelete = async (tier) => {
    if (!window.confirm("ยืนยันลบช่วงราคานี้?")) return;
    try {
      await api.delete(`/api/products/price-tiers/${tier.id}`);
      loadProductsAndTiers();
      toast.current.show({ severity: "success", summary: "ลบแล้ว" });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const addTier = async () => {
    const { min_area, max_area, productId } = newTier;
    const overlaps = checkOverlap(min_area, max_area, productId);

    if (overlaps) {
      toast.current.show({ severity: "error", summary: "พื้นที่ซ้ำกัน" });
      return;
    }

    try {
      await api.post(`/api/products/${newTier.productId}/price-tiers`, newTier);
      setShowAddDialog(false);
      setNewTier({
        thickness: "",
        min_area: 0,
        max_area: 0,
        price_per_sqm: 0,
        productId: null,
      });
      loadProductsAndTiers();
      toast.current.show({
        severity: "success",
        summary: "เพิ่มช่วงราคาสำเร็จ",
      });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const addThickness = async () => {
    try {
      // ส่งค่า newThickness และค่าพื้นที่และราคาเป็น 0
      await api.post(`/api/products/${newTier.productId}/price-tiers`, {
        thickness: newThickness,
        min_area: newTier.min_area,
        max_area: newTier.max_area,
        price_per_sqm: newTier.price_per_sqm,
      });
      setShowAddThicknessDialog(false);
      setNewThickness("");
      setNewTier({
        thickness: "",
        min_area: 0,
        max_area: 0,
        price_per_sqm: 0,
        productId: null,
      });
      loadProductsAndTiers();
      toast.current.show({
        severity: "success",
        summary: "เพิ่มความหนาสำเร็จ",
      });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const checkOverlap = (minArea, maxArea, productId) => {
    const existingTiers = tiers.filter((tier) => tier.productId === productId);
    return existingTiers.some(
      (tier) =>
        (minArea >= tier.min_area && minArea <= tier.max_area) ||
        (maxArea >= tier.min_area && maxArea <= tier.max_area)
    );
  };

  const filteredTiers = tiers.filter((tier) => {
    const matchesProduct =
      !filterProductId || tier.productId === filterProductId;
    const matchesSearch = tier.productName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesProduct && matchesSearch;
  });

  const formatPrice = (rowData) => {
    return rowData.price_per_sqm?.toLocaleString("th-TH") + " บาท";
  };

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-3">จัดการราคาต่อ ตร.ม. รายสินค้า</h2>

      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <Dropdown
            value={filterProductId}
            options={products.map((p) => ({ label: p.name, value: p.id }))}
            onChange={(e) => setFilterProductId(e.value)}
            placeholder="กรองสินค้าตามชื่อ"
            className="w-64"
            showClear
          />
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="ค้นหาด้วยคำในชื่อสินค้า"
            className="w-72"
          />
          <Button
            label="เพิ่มความหนา"
            icon="pi pi-plus"
            className="ml-4"
            onClick={() => setShowAddThicknessDialog(true)}
          />
          <Button
            label="เพิ่มช่วงราคา"
            icon="pi pi-plus"
            className="ml-4"
            onClick={() => setShowAddDialog(true)}
          />
        </div>
      </div>

      <DataTable
        value={filteredTiers}
        dataKey="id"
        editMode="row"
        onRowEditInit={(e) =>
          setEditing((p) => ({ ...p, [e.data.id]: { ...e.data } }))
        }
        onRowEditCancel={(e) => {
          const c = { ...editing };
          delete c[e.data.id];
          setEditing(c);
        }}
        onRowEditSave={onSaveRow}
        scrollable
        scrollHeight="500px"
        sortMode="multiple"
        paginator
        rows={rows}
        first={first}
        onPage={onPage}
        rowsPerPageOptions={[5, 10, 20, 50]}
      >
        <Column field="productName" header="สินค้า" sortable />
        <Column
          field="thickness"
          header="ความหนา"
          editor={(opts) => textEditor(opts, "thickness")}
          sortable
        />
        <Column
          field="min_area"
          header="พื้นที่ต่ำสุด"
          editor={(opts) => priceEditor(opts, "min_area")}
          sortable
        />
        <Column
          field="max_area"
          header="พื้นที่สูงสุด"
          editor={(opts) => priceEditor(opts, "max_area")}
          sortable
        />
        <Column
          field="price_per_sqm"
          header="ราคา/ตร.ม."
          body={formatPrice}
          editor={(opts) => priceEditor(opts, "price_per_sqm")}
          sortable
        />
        <Column
          rowEditor
          headerStyle={{ width: "7rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          header="ลบ"
          body={(row) => (
            <Button
              icon="pi pi-trash"
              className="p-button-text p-button-danger"
              onClick={() => onDelete(row)}
            />
          )}
        />
      </DataTable>

      <Dialog
        header="เพิ่มช่วงราคาใหม่"
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
      >
        <div className="field">
          <label>สินค้า</label>
          <Dropdown
            value={newTier.productId}
            options={products.map((p) => ({ label: p.name, value: p.id }))}
            onChange={(e) => setNewTier((p) => ({ ...p, productId: e.value }))}
            placeholder="เลือกสินค้า"
            className="w-full mb-3"
          />
        </div>

        <div className="field">
          <label>ความหนา</label>
          {tiers.filter((tier) => tier.productId === newTier.productId).length >
          0 ? (
            <Dropdown
              value={newTier.thickness}
              options={tiers
                .filter((tier) => tier.productId === newTier.productId)
                .map((t) => ({ label: t.thickness, value: t.thickness }))}
              onChange={(e) => {
                const selectedTier = tiers.find(
                  (tier) => tier.thickness === e.value
                );
                setNewTier((p) => ({
                  ...p,
                  thickness: e.value,
                  min_area: selectedTier ? selectedTier.min_area : 0,
                  max_area: selectedTier ? selectedTier.max_area : 0,
                }));
              }}
              placeholder="เลือกความหนา"
              className="w-full mb-3"
            />
          ) : (
            <div className="text-red-600">กรุณาไปเพิ่มความหนาก่อน</div>
          )}
        </div>

        <div className="grid formgrid">
          <div className="col-6">
            <label>พื้นที่ต่ำสุด</label>
            <InputNumber
              value={newTier.min_area}
              onValueChange={(e) =>
                setNewTier((p) => ({ ...p, min_area: e.value }))
              }
              className="w-full"
            />
          </div>
          <div className="col-6">
            <label>พื้นที่สูงสุด</label>
            <InputNumber
              value={newTier.max_area}
              onValueChange={(e) =>
                setNewTier((p) => ({ ...p, max_area: e.value }))
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="field">
          <label>ราคา/ตร.ม.</label>
          <InputNumber
            value={newTier.price_per_sqm}
            onValueChange={(e) =>
              setNewTier((p) => ({ ...p, price_per_sqm: e.value }))
            }
            mode="currency"
            currency="THB"
            locale="th-TH"
            className="w-full"
          />
        </div>

        <div className="mt-3">
          <Button
            label="บันทึก"
            icon="pi pi-check"
            onClick={addTier}
            disabled={
              !newTier.productId ||
              !newTier.thickness ||
              newTier.min_area <= 0 ||
              newTier.max_area <= 0 ||
              newTier.price_per_sqm <= 0
            }
          />
        </div>
      </Dialog>

      <Dialog
        header="เพิ่มความหนาใหม่"
        visible={showAddThicknessDialog}
        onHide={() => setShowAddThicknessDialog(false)}
      >
        <div className="field">
          <label>สินค้า</label>
          <Dropdown
            value={newTier.productId}
            options={products.map((p) => ({ label: p.name, value: p.id }))}
            onChange={(e) => setNewTier((p) => ({ ...p, productId: e.value }))}
            placeholder="เลือกสินค้า"
            className="w-full mb-3"
          />
        </div>

        <div className="field">
          <label>ความหนา</label>
          <InputText
            value={newThickness}
            onChange={(e) => setNewThickness(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid formgrid">
          <div className="col-6">
            <label>พื้นที่ต่ำสุด</label>
            <InputNumber
              value={newTier.min_area}
              onValueChange={(e) =>
                setNewTier((p) => ({ ...p, min_area: e.value }))
              }
              className="w-full"
            />
          </div>
          <div className="col-6">
            <label>พื้นที่สูงสุด</label>
            <InputNumber
              value={newTier.max_area}
              onValueChange={(e) =>
                setNewTier((p) => ({ ...p, max_area: e.value }))
              }
              className="w-full"
            />
          </div>
        </div>

        <div className="field">
          <label>ราคา/ตร.ม.</label>
          <InputNumber
            value={newTier.price_per_sqm}
            onValueChange={(e) =>
              setNewTier((p) => ({ ...p, price_per_sqm: e.value }))
            }
            mode="currency"
            currency="THB"
            locale="th-TH"
            className="w-full"
          />
        </div>

        <div className="mt-3">
          <Button
            label="เพิ่มความหนา"
            icon="pi pi-check"
            onClick={addThickness}
            disabled={
              !newTier.productId ||
              !newThickness ||
              newTier.min_area <= 0 ||
              newTier.max_area <= 0 ||
              newTier.price_per_sqm <= 0
            }
          />
        </div>
      </Dialog>
    </div>
  );
}
