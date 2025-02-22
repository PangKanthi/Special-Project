import React, { useState } from 'react';
import { Card } from "primereact/card";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

const Manageorders = () => {
    const orders = [
        { id: "00001", name: "Christine Brooks", address: "089 Kutch Green Apt. 448", date: "04 Sep 2019", type: "ซ่อม", status: "สำเร็จ" },
        { id: "00002", name: "Rosie Pearson", address: "979 Immanuel Ferry Suite 526", date: "28 May 2019", type: "ติดตั้ง", status: "กำลังทำ" },
        { id: "00003", name: "Darrell Caldwell", address: "8587 Frida Ports", date: "23 Nov 2019", type: "เช็ครายปี", status: "ยกเลิก" },
        { id: "00004", name: "Gilbert Johnston", address: "768 Destiny Lake Suite 600", date: "05 Feb 2019", type: "ติดตั้ง", status: "สำเร็จ" },
        { id: "00005", name: "Alan Cain", address: "042 Mylene Throughway", date: "29 Jul 2019", type: "ซ่อม", status: "กำลังทำ" },
        { id: "00006", name: "Alfred Murray", address: "543 Weimann Mountain", date: "15 Aug 2019", type: "ติดตั้ง", status: "สำเร็จ" },
        { id: "00007", name: "Maggie Sullivan", address: "New Scottieberg", date: "21 Dec 2019", type: "ติดตั้ง", status: "กำลังทำ" },
        { id: "00008", name: "Rosie Todd", address: "New Jon", date: "30 Apr 2019", type: "ซ่อม", status: "รออนุมัติ" },
        { id: "00009", name: "Dollie Hines", address: "124 Lyla Forge Suite 975", date: "09 Jan 2019", type: "ติดตั้ง", status: "กำลังทำ" }
    ];

    const [search, setSearch] = useState("");

    const statusTemplate = (rowData) => {
        const statusColor = {
            "สำเร็จ": "success",
            "กำลังทำ": "info",
            "รออนุมัติ": "warning",
            "ยกเลิก": "danger"
        };
        return <Tag value={rowData.status} severity={statusColor[rowData.status]} />;
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Order List</h2>
            <Card className="p-4 mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 ">
                    <Button icon="pi pi-filter" label="Filter By" className="p-button-outlined p-button-secondary" />
                    <Dropdown options={["14 Feb 2019", "28 May 2019", "05 Feb 2019"]} placeholder="14 Feb 2019" />
                    <Dropdown options={["ซ่อม", "ติดตั้ง", "เช็ครายปี"]} placeholder="Order Type" />
                    <Dropdown options={["ทั้งหมด", "สำเร็จ", "กำลังทำ", "ยกเลิก"]} placeholder="Order Status" />
                    <Button icon="pi pi-refresh" label="Reset Filter" className="p-button-danger p-button-outlined" />
                    <div className="ml-auto">
                        <span className="p-input-icon-left ">
                            <i className="pi pi-search pl-2" />
                            <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Order" className="w-72" />
                        </span>
                    </div>
                </div>
            </Card>

            <Card>
                <DataTable value={orders} paginator rows={9}>
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="name" header="NAME" sortable></Column>
                    <Column field="address" header="ADDRESS" sortable></Column>
                    <Column field="date" header="DATE" sortable></Column>
                    <Column field="type" header="TYPE" sortable></Column>
                    <Column field="status" header="STATUS" body={statusTemplate} sortable></Column>
                    <Column header="ACTION" body={(rowData) => (
                        <div className="flex gap-2">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-secondary p-button-sm" />
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" />
                        </div>
                    )}></Column>
                </DataTable>
            </Card>
        </div>
    );
};

export default Manageorders;
