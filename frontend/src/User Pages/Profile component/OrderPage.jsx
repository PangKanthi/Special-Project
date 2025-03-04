import React from "react";
import { TabMenu } from "primereact/tabmenu";

const OrderPage = () => {
    const items = [
        { label: "ทั้งหมด", icon: "pi pi-list" },
        { label: "ที่ต้องชำระ", icon: "pi pi-credit-card" },
        { label: "ที่ต้องจัดส่ง", icon: "pi pi-truck" },
        { label: "ที่ต้องได้รับ", icon: "pi pi-inbox" },
        { label: "สำเร็จ", icon: "pi pi-check" },
        { label: "ยกเลิก", icon: "pi pi-times" }
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

export default OrderPage;
