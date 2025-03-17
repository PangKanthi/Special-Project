import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";

export default function NotificationButton() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const response = await axios.get("/api/notifications"); // เรียก API ดึงข้อมูลแจ้งเตือน
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    }

    async function markAsRead(id) {
        try {
            await axios.put(`/api/notifications/${id}/read`); // อัปเดตสถานะแจ้งเตือนเป็น "อ่านแล้ว"
            fetchNotifications(); // รีเฟรชข้อมูลแจ้งเตือน
        } catch (error) {
            console.error("Error marking notification as read", error);
        }
    }

    return (
        <div>
            <Button
                label={`🔔 แจ้งเตือน (${unreadCount})`}
                className="p-button-rounded p-button-warning"
                onClick={() => setDialogVisible(true)}
            />
            
            <Dialog 
                header="📢 การแจ้งเตือน" 
                visible={dialogVisible} 
                style={{ width: "50vw" }}
                onHide={() => setDialogVisible(false)}
            >
                <DataTable value={notifications} paginator rows={5} emptyMessage="ไม่มีการแจ้งเตือน">
                    <Column field="message" header="ข้อความ" />
                    <Column field="createdAt" header="วันที่" body={(rowData) => new Date(rowData.createdAt).toLocaleString()} />
                    <Column 
                        header="การกระทำ" 
                        body={(rowData) => (
                            !rowData.isRead && (
                                <Button label="✔ อ่านแล้ว" className="p-button-sm p-button-success" onClick={() => markAsRead(rowData.id)} />
                            )
                        )} 
                    />
                </DataTable>
            </Dialog>
        </div>
    );
}
