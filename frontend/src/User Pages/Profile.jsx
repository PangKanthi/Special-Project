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
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [profile, setProfile] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: ""
    });
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [userId, setuseId] = useState(null);

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/users/me`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setProfile({
                firstname: response.data.firstname,
                lastname: response.data.lastname,
                email: response.data.email,
                phone: response.data.phone,
                password: ""  // เพื่อความปลอดภัย ไม่ควรดึงรหัสผ่านมา
            });
            setuseId(
                response.data.id
            );
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const saveProfile = async () => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API}/users/me/profile`,
                { profile }, // หากไม่มีข้อมูลที่ต้องส่ง ให้ใส่ {} 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            alert("อัปเดตโปรไฟล์สำเร็จ");
            setEditDialog(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                console.log("Server Response:", error.response.data); // ดู error message จาก backend
                alert(`เกิดข้อผิดพลาด: ${error.response.data.error || "ไม่สามารถอัปเดตโปรไฟล์ได้"}`);
            } else {
                alert("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
            }
        }
    };



    const changePassword = async () => {
        if (!oldPassword || !newPassword) {
            alert("กรุณากรอกรหัสผ่านเก่าและรหัสผ่านใหม่");
            return;
        }
        try {
            await axios.put(`${process.env.REACT_APP_API}/users/me/password`, {
                oldPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("เปลี่ยนรหัสผ่านสำเร็จ");
            setOldPassword("");
            setProfile({ ...profile, password: "" });
            setPasswordDialog(false);
        } catch (error) {
            console.error("Error changing password:", error);
            alert("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
        }
    };

    const sidebarItems = [
        { label: "คำสั่งซื้อของฉัน", icon: "pi pi-shopping-cart" },
        { label: "ที่อยู่", icon: "pi pi-map-marker" },
        { label: "แจ้งซ่อม", icon: "pi pi-wrench" }
    ];

    return (
        <div className="flex flex-column lg:flex-row p-4">
            <aside className="lg:w-1/5 bg-blue-600 text-white p-4 border-round-lg shadow-2" style={{ width: "300px", height: "350px" }}>
                <div className="flex flex-column align-items-center">
                    <h2 className="text-lg font-semibold">{profile.firstname} {profile.lastname}</h2>
                    <Button label="แก้ไขโปรไฟล์" onClick={() => setEditDialog(true)} />
                    <Button label="เปลี่ยนรหัสผ่าน" onClick={() => setPasswordDialog(true)} className="p-button-secondary ml-2" />
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
            <div className="flex">
                <Dialog
                    draggable={false}
                    visible={editDialog}
                    style={{ width: "500px", height: "auto" }}
                    position="center"
                    modal
                    onHide={() => setEditDialog(false)}
                    header="แก้ไขโปรไฟล์"
                >
                    <div className="p-fluid">
                        <p>ชื่อ</p>
                        <InputText name="firstname" value={profile.firstname} onChange={handleChange} placeholder="ชื่อ" />

                        <p>นามสกุล</p>
                        <InputText name="lastname" value={profile.lastname} onChange={handleChange} placeholder="นามสกุล" />

                        <p>โทรศัพท์</p>
                        <InputText name="phone" value={profile.phone} onChange={handleChange} placeholder="เบอร์โทรศัพท์" />

                        <p>Email</p>
                        <InputText name="email" value={profile.email} placeholder="Email" />

                        <Button label="บันทึก" onClick={saveProfile} className="mt-3" />
                    </div>
                </Dialog>
                <Dialog visible={passwordDialog} onHide={() => setPasswordDialog(false)} header="เปลี่ยนรหัสผ่าน">
                    <Password value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="รหัสผ่านเก่า" />
                    <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="รหัสผ่านใหม่" />
                    <Button label="เปลี่ยนรหัสผ่าน" onClick={changePassword} />
                </Dialog>
            </div>
        </div>
    );
};

export default Profile;
