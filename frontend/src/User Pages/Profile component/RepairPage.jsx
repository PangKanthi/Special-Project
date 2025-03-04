import React from "react";
import { TabMenu } from "primereact/tabmenu";

const RepairPage = () => {
    const items = [
        { label: "ทั้งหมด", icon: "pi pi-th-large" },
        { label: "รอการยืนยัน", icon: "pi pi-cock" },
        { label: "ได้รับการยืนยันแล้ว", icon: "pi pi-check-circle" },
    ];

    return (
        <>
            <div className="flex flex-row flex-wrap gap-5">
                <TabMenu model={items} className="flex flex-wrap" />
            </div>
            <div className="flex flex-column align-items-center justify-content-center h-15rem text-gray-500">
                <i className="pi pi-file text-4xl mb-2" />
                <p>ยังไม่มีคำสั่งซื้อ</p>
            </div>
        </>
    );
};

export default RepairPage;
