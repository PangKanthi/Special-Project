import React, { useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";

// Import คอมโพเนนต์แต่ละหน้า
import OrderPage from "./Profile component/OrderPage";
import AddressPage from "./Profile component/AddressPage";
import RepairPage from "./Profile component/RepairPage";

const Profile = () => {
    const [selectedMenu, setSelectedMenu] = useState("คำสั่งซื้อของฉัน");

    const sidebarItems = [
        { label: "คำสั่งซื้อของฉัน", icon: "pi pi-shopping-cart" },
        { label: "ที่อยู่", icon: "pi pi-map-marker" },
        { label: "แจ้งซ่อม", icon: "pi pi-wrench" }
    ];

    return (
        <div className="flex flex-column lg:flex-row p-4">
            {/* Sidebar */}
            <aside className="lg:w-1/5 bg-blue-600 text-white p-4 border-round-lg shadow-2" style={{ width: "300px", height: "350px", objectFit: "cover" }}>
                <div className="flex flex-column align-items-center">
                    <h2 className="text-lg font-semibold">Ben Tennyson</h2>
                    <Button label="แก้ไขโปรไฟล์" className="p-button-text mt-2 text-white" />
                </div>
                <Divider className="my-3 border-white" />
                <nav>
                    <ul className="list-none p-0">
                        {sidebarItems.map((item, index) => (
                            <li key={index} className={classNames("p-3 cursor-pointer flex align-items-center justify-content-between hover:bg-blue-500 border-round", { "bg-blue-400": selectedMenu === item.label })} onClick={() => setSelectedMenu(item.label)}>
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
            <main className="flex-1 bg-white border-round-lg p-5 shadow-2 ml-0 lg:ml-3 mt-4 lg:mt-0" style={{ height: "900px", objectFit: "cover" }}>
                <div>
                    <h2>{selectedMenu}</h2>
                </div>

                {/* Render UI ตามเมนูที่เลือก */}
                {selectedMenu === "คำสั่งซื้อของฉัน" && <OrderPage />}
                {selectedMenu === "ที่อยู่" && <AddressPage />}
                {selectedMenu === "แจ้งซ่อม" && <RepairPage />}
            </main>
        </div>
    );
};

export default Profile;
