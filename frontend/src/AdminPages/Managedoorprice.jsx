import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';

const Managedoorprice = () => {
    const [rows, setRows] = useState([]);
    const [editingRows, setEditingRows] = useState({});
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('/mockData/doorConfig.json');
            const formatted = [];

            Object.entries(res.data).forEach(([categoryKey, category]) => {
                category.priceTiers.forEach((tier, i) => {
                    if (tier.pricePerSqm) {
                        formatted.push({
                            id: `${categoryKey}-${i}`,
                            categoryKey,
                            categoryName: category.displayName,
                            thickness: tier.thickness,
                            areaRange: `${tier.minArea} - ${tier.maxArea}`,
                            pricePerSqm: tier.pricePerSqm,
                            isRange: false
                        });
                    } else if (tier.priceRanges) {
                        tier.priceRanges.forEach((range, rIdx) => {
                            formatted.push({
                                id: `${categoryKey}-${i}-${rIdx}`,
                                categoryKey,
                                categoryName: category.displayName,
                                thickness: tier.thickness,
                                areaRange: `${range.minArea} - ${range.maxArea}`,
                                pricePerSqm: range.pricePerSqm,
                                isRange: true
                            });
                        });
                    }
                });
            });

            setRows(formatted);
        };

        fetchData();
    }, []);

    const onRowEditInit = (event) => {
        setEditingRows({ ...editingRows, [event.data.id]: { ...event.data } });
    };

    const onRowEditCancel = (event) => {
        const updated = { ...editingRows };
        delete updated[event.data.id];
        setEditingRows(updated);
    };

    const onRowEditSave = (event) => {
        const updatedRows = [...rows];
        const index = updatedRows.findIndex((item) => item.id === event.data.id);
        updatedRows[index] = editingRows[event.data.id];
        setRows(updatedRows);

        const updated = { ...editingRows };
        delete updated[event.data.id];
        setEditingRows(updated);

        toast.current.show({
            severity: 'success',
            summary: 'บันทึกสำเร็จ',
            detail: `อัปเดตราคา: ${updatedRows[index].categoryName}`,
            life: 2000
        });
    };

    const priceEditor = (options) => {
        const rowId = options.rowData.id;
    
        const currentEditing = editingRows[rowId] || { ...options.rowData };
    
        return (
            <InputNumber
                value={currentEditing.pricePerSqm}
                onValueChange={(e) => {
                    const updated = { ...editingRows };
    
                    // ถ้ายังไม่มี row นี้ใน editingRows ให้สร้างใหม่
                    if (!updated[rowId]) {
                        updated[rowId] = { ...options.rowData };
                    }
    
                    updated[rowId].pricePerSqm = e.value;
                    setEditingRows(updated);
                }}
                mode="currency"
                currency="THB"
                locale="th-TH"
            />
        );
    };
    

    const saveAllPrices = () => {
        // สมมุติว่าเราส่ง rows ไปยัง backend
        toast.current.show({ severity: 'success', summary: 'บันทึกราคา', detail: 'บันทึกราคาทั้งหมดเรียบร้อย', life: 3000 });
        console.log('ข้อมูลที่บันทึกทั้งหมด:', rows);
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <h2 className="text-2xl font-bold mb-4">จัดการราคาประตู</h2>

            <DataTable
                value={rows}
                editMode="row"
                dataKey="id"
                responsiveLayout="scroll"
                scrollable
                scrollHeight="500px"
                paginator rows={10}
                onRowEditInit={onRowEditInit}
                onRowEditCancel={onRowEditCancel}
                onRowEditSave={onRowEditSave}
            >
                <Column field="categoryName" header="ประเภทประตู" sortable style={{ minWidth: '12rem' }} />
                <Column field="thickness" header="ความหนา" sortable />
                <Column field="areaRange" header="ช่วงพื้นที่ (ตร.ม.)" />
                <Column
                    field="pricePerSqm"
                    header="ราคา/ตร.ม."
                    editor={priceEditor}
                    body={(rowData) =>
                        rowData.pricePerSqm?.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })
                    }
                    style={{ minWidth: '12rem' }}
                />
                <Column rowEditor header="แก้ไข" style={{ width: '10%', textAlign: 'center' }} />
            </DataTable>

            <div className="text-right mt-4">
                <Button
                    label="บันทึกราคาทั้งหมด"
                    icon="pi pi-save"
                    className="p-button-success"
                    onClick={saveAllPrices}
                />
            </div>
        </div>
    );
};

export default Managedoorprice;
