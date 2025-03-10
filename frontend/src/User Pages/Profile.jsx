import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import OrderPage from "./Profile component/OrderPage";
import AddressPage from "./Profile component/AddressPage";
import RepairPage from "./Profile component/RepairPage";
import axios from "axios";

const Profile = () => {
    const [selectedMenu, setSelectedMenu] = useState("คำสั่งซื้อของฉัน");
    const [editDialog, setEditDialog] = useState(false);
    const [profile, setProfile] = useState({
        firstname: "Ben",
        lastname: "Tennyson",
        email: "ben.tennyson@example.com",
        phone: "0812345678",
        password: ""
    });
    const [oldPassword, setOldPassword] = useState("");

    useEffect(() => {
        getUserProfile();
    }, [])



    const getUserProfile = async () => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/users/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }

            });


            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    const openEditDialog = () => {
        setEditDialog(true);
    };

    const hideEditDialog = () => {
        setEditDialog(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const saveProfile = () => {
        if (!oldPassword) {
            alert("กรุณากรอกรหัสผ่านเก่าก่อนทำการเปลี่ยนรหัสผ่าน");
            return;
        }
        console.log("Updated Profile:", profile);
        hideEditDialog();
    };

    const sidebarItems = [
        { label: "คำสั่งซื้อของฉัน", icon: "pi pi-shopping-cart" },
        { label: "ที่อยู่", icon: "pi pi-map-marker" },
        { label: "แจ้งซ่อม", icon: "pi pi-wrench" }
    ];

    return (
        <div className="flex flex-column lg:flex-row p-4">
            {/* Sidebar */}
            <aside className="lg:w-1/5 bg-blue-600 text-white p-4 border-round-lg shadow-2" style={{ width: "300px", height: "350px" }}>
                <div className="flex flex-column align-items-center">
                    <h2 className="text-lg font-semibold">{profile.firstname} {profile.lastname}</h2>
                    <Button label="แก้ไขโปรไฟล์" className="p-button-text mt-2 text-white" onClick={openEditDialog} />
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

            <main className="flex-1 bg-white border-round-lg p-5 shadow-2 ml-0 lg:ml-3 mt-4 lg:mt-0" style={{ height: "900px" }}>
                <div>
                    <h2>{selectedMenu}</h2>
                </div>
                {selectedMenu === "คำสั่งซื้อของฉัน" && <OrderPage />}
                {selectedMenu === "ที่อยู่" && <AddressPage />}
                {selectedMenu === "แจ้งซ่อม" && <RepairPage />}
            </main>

            <Dialog
                visible={editDialog}
                onHide={hideEditDialog}
                header="แก้ไขโปรไฟล์"
                draggable={false}
                style={{ width: "500px", height: "550px", objectFit: "cover" }}
                modal footer={
                    <div className="pr-2">
                        <Button label="ยกเลิก" icon="pi pi-times" onClick={hideEditDialog} className="p-button-text" />
                        <Button label="บันทึก" icon="pi pi-check" onClick={saveProfile} autoFocus />
                    </div>
                }>
                <div className="p-fluid">
                    <div className="p-field">
                        <label>ชื่อ</label>
                        <InputText name="firstname" value={profile.firstname} onChange={handleChange} />
                    </div>
                    <div className="p-field pt-2">
                        <label>นามสกุล</label>
                        <InputText name="lastname" value={profile.lastname} onChange={handleChange} />
                    </div>
                    <div className="p-field pt-2">
                        <label>Email</label>
                        <InputText name="email" value={profile.email} onChange={handleChange} disabled />
                    </div>
                    <div className="p-field pt-2">
                        <label>โทรศัพท์</label>
                        <InputText name="phone" value={profile.phone} onChange={handleChange} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Profile;