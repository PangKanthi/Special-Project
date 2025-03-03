import React from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Panel } from "primereact/panel";
import { TabMenu } from "primereact/tabmenu";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Menu } from "primereact/menu";

const Profile = () => {
  const items = [
    { label: "ทั้งหมด", icon: "pi pi-list" },
    { label: "ที่ต้องชำระ", icon: "pi pi-credit-card" },
    { label: "ที่ต้องจัดส่ง", icon: "pi pi-truck" },
    { label: "ที่ต้องได้รับ", icon: "pi pi-inbox" },
    { label: "สำเร็จ", icon: "pi pi-check" },
    { label: "ยกเลิก", icon: "pi pi-times" }
  ];

  const sidebarItems = [
    { label: "คำสั่งซื้อของฉัน", icon: "pi pi-shopping-cart" },
    { label: "ที่อยู่", icon: "pi pi-map-marker" },
    { label: "แจ้งซ่อม", icon: "pi pi-wrench" }
  ];

  return (
    <div className="flex flex-column lg:flex-row min-h-screen p-4">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/5 bg-blue-600 text-white p-4 border-round-lg shadow-2">
        <div className="flex flex-column align-items-center">
          <Avatar image="https://via.placeholder.com/80" shape="circle" size="large" className="mb-3 border-2 border-white" />
          <h2 className="text-lg font-semibold">Ben Tennyson</h2>
          <Button label="แก้ไขโปรไฟล์" className="p-button-text mt-2 text-white" />
        </div>
        <Divider className="my-3 border-white" />
        <nav>
          <ul className="list-none p-0">
            {sidebarItems.map((item, index) => (
              <li key={index} className="p-3 cursor-pointer flex align-items-center justify-content-between hover:bg-blue-500 border-round">
                <div className="flex align-items-center gap-2">
                  <i className={item.icon}></i> {item.label}
                </div>
                <i className="pi pi-angle-right"></i>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white border-round-lg p-6 shadow-2 ml-0 lg:ml-6 mt-4 lg:mt-0">
        <Panel header="คำสั่งซื้อของฉัน" className="mb-4 p-3" />
        <TabMenu model={items} className="mb-4" />
        <div className="flex flex-column align-items-center justify-content-center h-10rem text-gray-500">
          <i className="pi pi-file text-4xl mb-2" />
          <p>ยังไม่มีคำสั่งซื้อ</p>
        </div>
      </main>
    </div>
  );
};

export default Profile;