import React, { useState } from "react";
import { TabMenu } from "primereact/tabmenu";
import RepairHistory from "./ManageHistory component/RepairHistory";
import ProductHistory from "./ManageHistory component/ProductHistory";

const History = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: "ประวัติแจ้งซ่อม", icon: "pi pi-wrench" },
    { label: "ประวัติสินค้า", icon: "pi pi-box" }
  ];

  return (
    <div className="p-6 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white p-6 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold">ประวัติการใช้งาน</h1>

          {/* Tab Menu */}
          <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} className="mb-4" />
            

          {/* แสดง Component ตาม Tab ที่เลือก */}
          {activeIndex === 0 ? <RepairHistory /> : <ProductHistory />}
        </div>
      </div>
  );
};

export default History;
