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
  const [newTier, setNewTier] = useState({ thickness: "", min_area: 0, max_area: 0, price_per_sqm: 0, productId: null });
  const toast = useRef(null);
  const [filterProductId, setFilterProductId] = useState(null);

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
        const tiersWithProduct = resTier.data.map(t => ({ ...t, productId: p.id, productName: p.name }));
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
      await api.patch(`/api/products/price-tiers/${data.id}`, upd);
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
    try {
      await api.post(`/api/products/${newTier.productId}/price-tiers`, newTier);
      setShowAddDialog(false);
      setNewTier({ thickness: "", min_area: 0, max_area: 0, price_per_sqm: 0, productId: null });
      loadProductsAndTiers();
      toast.current.show({ severity: "success", summary: "เพิ่มช่วงราคาสำเร็จ" });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const filteredTiers = filterProductId ? tiers.filter(t => t.productId === filterProductId) : tiers;

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h2 className="text-xl font-bold mb-3">จัดการราคาต่อ ตร.ม. รายสินค้า</h2>

      <div className="flex gap-3 mb-4">
        <Dropdown
          value={filterProductId}
          options={products.map(p => ({ label: p.name, value: p.id }))}
          onChange={(e) => setFilterProductId(e.value)}
          placeholder="กรองสินค้าตามชื่อ"
          className="w-64"
          showClear
        />
        <Button label="เพิ่มช่วงราคา" onClick={() => setShowAddDialog(true)} />
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
      >
        <Column field="productName" header="สินค้า" />
        <Column field="thickness" header="ความหนา" editor={(opts) => textEditor(opts, "thickness")} />
        <Column field="min_area" header="พื้นที่ต่ำสุด" editor={(opts) => priceEditor(opts, "min_area")} />
        <Column field="max_area" header="พื้นที่สูงสุด" editor={(opts) => priceEditor(opts, "max_area")} />
        <Column field="price_per_sqm" header="ราคา/ตร.ม." editor={(opts) => priceEditor(opts, "price_per_sqm")} />
        <Column rowEditor headerStyle={{ width: "7rem" }} bodyStyle={{ textAlign: "center" }} />
        <Column
          header="ลบ"
          body={(row) => (
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => onDelete(row)} />
          )}
        />
      </DataTable>

      <Dialog header="เพิ่มช่วงราคาใหม่" visible={showAddDialog} onHide={() => setShowAddDialog(false)}>
        <div className="field">
          <label>สินค้า</label>
          <Dropdown
            value={newTier.productId}
            options={products.map(p => ({ label: p.name, value: p.id }))}
            onChange={(e) => setNewTier((p) => ({ ...p, productId: e.value }))}
            placeholder="เลือกสินค้า"
            className="w-full mb-3"
          />
        </div>
        <div className="field">
          <label>ความหนา</label>
          <InputText value={newTier.thickness} onChange={(e) => setNewTier((p) => ({ ...p, thickness: e.target.value }))} className="w-full" />
        </div>
        <div className="grid formgrid">
          <div className="col-6">
            <label>พื้นที่ต่ำสุด</label>
            <InputNumber value={newTier.min_area} onValueChange={(e) => setNewTier((p) => ({ ...p, min_area: e.value }))} className="w-full" />
          </div>
          <div className="col-6">
            <label>พื้นที่สูงสุด</label>
            <InputNumber value={newTier.max_area} onValueChange={(e) => setNewTier((p) => ({ ...p, max_area: e.value }))} className="w-full" />
          </div>
        </div>
        <div className="field">
          <label>ราคา/ตร.ม.</label>
          <InputNumber value={newTier.price_per_sqm} onValueChange={(e) => setNewTier((p) => ({ ...p, price_per_sqm: e.value }))} mode="currency" currency="THB" locale="th-TH" className="w-full" />
        </div>
        <div className="mt-3">
          <Button label="บันทึก" icon="pi pi-check" onClick={addTier} disabled={!newTier.productId} />
        </div>
      </Dialog>
    </div>
  );
}