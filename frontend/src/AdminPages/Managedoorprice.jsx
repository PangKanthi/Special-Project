// src/pages/Managedoorprice.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

/* ---------- 1) axios instance ---------- */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // หรือจาก context/auth state
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ---------- 2) service layer ---------- */
const api = {
  // door‑config CRUD
  fetchAll: () => apiClient.get("/api/door-config").then((r) => r.data),
  createConfig: (p) => apiClient.post("/api/door-config", p),
  deleteConfig: (id) => apiClient.delete(`/api/door-config/${id}`),

  // tier / range
  createTier: (cfgId, p) =>
    apiClient.post(`/api/door-config/${cfgId}/price-tier`, p),
  updateTier: (id, p) =>
    apiClient.patch(`/api/door-config/price-tier/${id}`, p),
  deleteTier: (id) => apiClient.delete(`/api/door-config/price-tier/${id}`),

  createRange: (tierId, p) =>
    apiClient.post(`/api/door-config/price-range/${tierId}`, p),
  updateRange: (id, p) =>
    apiClient.patch(`/api/door-config/price-range/${id}`, p),
  deleteRange: (id) => apiClient.delete(`/api/door-config/price-range/${id}`),

  // -------- bulk import --------
  bulkImport: (jsonObj) => apiClient.post("/api/door-config/bulk", jsonObj),
};

/* ---------- helper: flatten ---------- */
const flatten = (cfgs) =>
  cfgs.flatMap((cfg) =>
    cfg.priceTiers.flatMap((tier) => {
      const base = {
        doorConfigId: cfg.id,
        priceTierId: tier.id,
        categoryKey: cfg.key,
        categoryName: cfg.display_name,
        thickness: tier.thickness,
      };

      if (tier.price_per_sqm) {
        return [
          {
            ...base,
            id: `tier-${tier.id}`,
            priceRangeId: null,
            areaRange: `${tier.min_area} - ${tier.max_area}`,
            pricePerSqm: tier.price_per_sqm,
            isRange: false,
          },
        ];
      }

      return (tier.priceRanges ?? []).map((rg) => ({
        ...base,
        id: `range-${rg.id}`,
        priceRangeId: rg.id,
        areaRange: `${rg.min_area} - ${rg.max_area}`,
        pricePerSqm: rg.price_per_sqm,
        isRange: true,
      }));
    })
  );

/* ================= COMPONENT ================= */
export default function Managedoorprice() {
  /* ---------- state ---------- */
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState({});

  const [dlgCfg, setDlgCfg] = useState(false);
  const [dlgTier, setDlgTier] = useState(false);
  const [dlgImport, setDlgImport] = useState(false);

  const [newCfg, setNewCfg] = useState({ key: "", display_name: "" });
  const [newTier, setNewTier] = useState({
    cfgId: null,
    thickness: "",
    min_area: 0,
    max_area: 0,
    price_per_sqm: 0,
  });

  const [jsonFile, setJsonFile] = useState(null);

  const toast = useRef(null);

  /* ---------- READ ---------- */
  const load = async () => {
    try {
      const data = await api.fetchAll();
      setRows(flatten(data));
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };
  useEffect(() => {
    load();
  }, []);

  /* ---------- editor ---------- */
  const priceEditor = (opts) => {
    const r = editing[opts.rowData.id] || opts.rowData;
    return (
      <InputNumber
        value={r.pricePerSqm}
        onValueChange={(e) =>
          setEditing((p) => ({
            ...p,
            [opts.rowData.id]: { ...r, pricePerSqm: e.value },
          }))
        }
        mode="currency"
        currency="THB"
        locale="th-TH"
        min={0}
      />
    );
  };

  const onSaveRow = async ({ data }) => {
    const upd = editing[data.id];
    try {
      if (upd.isRange)
        await api.updateRange(upd.priceRangeId, {
          price_per_sqm: upd.pricePerSqm,
        });
      else
        await api.updateTier(upd.priceTierId, {
          price_per_sqm: upd.pricePerSqm,
        });

      setEditing((p) => {
        const c = { ...p };
        delete c[data.id];
        return c;
      });
      await load();
      toast.current.show({ severity: "success", summary: "บันทึกแล้ว" });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const onDelete = async (row) => {
    if (
      !window.confirm(
        `ลบ ${row.categoryName} (${row.thickness}) ${row.areaRange}?`
      )
    )
      return;
    try {
      row.isRange
        ? await api.deleteRange(row.priceRangeId)
        : await api.deleteTier(row.priceTierId);
      await load();
      toast.current.show({ severity: "success", summary: "ลบแล้ว" });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  /* ---------- add config / tier ---------- */
  const addConfig = async () => {
    try {
      await api.createConfig(newCfg);
      setDlgCfg(false);
      setNewCfg({ key: "", display_name: "" });
      await load();
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  const addTier = async () => {
    try {
      const { cfgId, ...body } = newTier;
      await api.createTier(cfgId, body);
      setDlgTier(false);
      setNewTier({
        cfgId: null,
        thickness: "",
        min_area: 0,
        max_area: 0,
        price_per_sqm: 0,
      });
      await load();
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  /* ---------- bulk import ---------- */
  const handleFileChange = (e) => setJsonFile(e.target.files?.[0] || null);

  const doImport = async () => {
    if (!jsonFile) return;
    try {
      const text = await jsonFile.text();
      const json = JSON.parse(text);
      await api.bulkImport(json);
      setDlgImport(false);
      setJsonFile(null);
      await load();
      toast.current.show({
        severity: "success",
        summary: "นำเข้าข้อมูลสำเร็จ",
      });
    } catch (err) {
      toast.current.show({ severity: "error", summary: err.message });
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-5">
      <Toast ref={toast} />

      <div className="flex justify-content-between mb-3">
        <h2 className="text-xl font-bold">จัดการราคาประตู</h2>

        <div className="flex gap-2">
          <Button
            label="เพิ่มประเภทประตู"
            icon="pi pi-plus"
            onClick={() => setDlgCfg(true)}
          />
          <Button
            label="เพิ่มช่วงราคา"
            icon="pi pi-plus-circle"
            className="p-button-success"
            onClick={() => setDlgTier(true)}
          />
          <Button
            label="นำเข้า JSON"
            icon="pi pi-upload"
            className="p-button-help"
            onClick={() => setDlgImport(true)}
          />
        </div>
      </div>

      <DataTable
        value={rows}
        dataKey="id"
        paginator
        rows={6}
        editMode="row"
        onRowEditInit={(e) =>
          setEditing((p) => ({ ...p, [e.data.id]: { ...e.data } }))
        }
        onRowEditCancel={(e) =>
          setEditing((p) => {
            const c = { ...p };
            delete c[e.data.id];
            return c;
          })
        }
        onRowEditSave={onSaveRow}
        responsiveLayout="scroll"
        scrollable
        scrollHeight="500px"
      >
        <Column field="categoryName" header="ประเภทประตู" sortable />
        <Column field="thickness" header="ความหนา" sortable />
        <Column field="areaRange" header="ช่วงพื้นที่ (ตร.ม.)" />
        <Column
          field="pricePerSqm"
          header="ราคา/ตร.ม."
          body={(d) =>
            d.pricePerSqm.toLocaleString("th-TH", {
              style: "currency",
              currency: "THB",
            })
          }
          editor={priceEditor}
        />
        <Column
          rowEditor
          headerStyle={{ width: "8rem" }}
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
          style={{ width: "4rem", textAlign: "center" }}
        />
      </DataTable>

      {/* dialog: add config */}
      <Dialog
        header="เพิ่มประเภทประตู"
        visible={dlgCfg}
        onHide={() => setDlgCfg(false)}
        footer={
          <Button label="บันทึก" icon="pi pi-check" onClick={addConfig} />
        }
      >
        <div className="field">
          <label>Key (อังกฤษ)</label>
          <InputText
            value={newCfg.key}
            onChange={(e) => setNewCfg({ ...newCfg, key: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="field">
          <label>ชื่อที่แสดง</label>
          <InputText
            value={newCfg.display_name}
            onChange={(e) =>
              setNewCfg({ ...newCfg, display_name: e.target.value })
            }
            className="w-full"
          />
        </div>
      </Dialog>

      {/* dialog: add tier */}
      <Dialog
        header="เพิ่มช่วงราคา"
        visible={dlgTier}
        onHide={() => setDlgTier(false)}
        footer={<Button label="บันทึก" icon="pi pi-check" onClick={addTier} />}
      >
        <div className="field">
          <label>doorConfigId</label>
          <InputText
            value={newTier.cfgId || ""}
            onChange={(e) =>
              setNewTier({ ...newTier, cfgId: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <div className="field">
          <label>ความหนา</label>
          <InputText
            value={newTier.thickness}
            onChange={(e) =>
              setNewTier({ ...newTier, thickness: e.target.value })
            }
            className="w-full"
          />
        </div>
        <div className="p-fluid grid formgrid">
          <div className="field col-6">
            <label>Min Area</label>
            <InputNumber
              value={newTier.min_area}
              onValueChange={(e) =>
                setNewTier({ ...newTier, min_area: e.value })
              }
              className="w-full"
            />
          </div>
          <div className="field col-6">
            <label>Max Area</label>
            <InputNumber
              value={newTier.max_area}
              onValueChange={(e) =>
                setNewTier({ ...newTier, max_area: e.value })
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
              setNewTier({ ...newTier, price_per_sqm: e.value })
            }
            mode="currency"
            currency="THB"
            locale="th-TH"
            className="w-full"
          />
        </div>
      </Dialog>

      {/* dialog: import JSON */}
      <Dialog
        header="นำเข้า doorConfig.json"
        visible={dlgImport}
        onHide={() => {
          setDlgImport(false);
          setJsonFile(null);
        }}
        footer={
          <Button
            label="อัปโหลด"
            icon="pi pi-check"
            disabled={!jsonFile}
            onClick={doImport}
          />
        }
      >
        <input
          type="file"
          accept="application/json"
          onChange={handleFileChange}
        />
        {jsonFile && (
          <p className="mt-2 text-sm">ไฟล์ที่เลือก: {jsonFile.name}</p>
        )}
      </Dialog>
    </div>
  );
}
