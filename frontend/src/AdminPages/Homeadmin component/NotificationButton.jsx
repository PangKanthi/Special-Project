import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NotificationButton() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (dialogVisible) {
      fetchNotifications(); // โหลดใหม่ทุกครั้งที่เปิด Dialog
    }
  }, [dialogVisible]);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allNotifications = response.data || [];

      // ✅ แสดงเฉพาะที่ยังไม่ได้อ่าน
      const unread = allNotifications.filter((n) => !n.isRead);

      setNotifications(unread);
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }

  async function markAsRead(id, message) {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API}/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 👉 เปลี่ยน path ตามประเภทข้อความ
      if (message.includes("คำสั่งซื้อ")) {
        navigate("/manageorders");
      } else if (message.includes("คำขอซ่อม")) {
        navigate("/managerepairrequests");
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  }

  const messageTemplate = (rowData) => (
    <span style={{ fontWeight: rowData.isRead ? "normal" : "bold" }}>
      {rowData.message}
    </span>
  );

  const dateTemplate = (rowData) =>
    new Date(rowData.createdAt).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const actionTemplate = (rowData) =>
    !rowData.isRead && (
      <Button
        label="ดูรายการ"
        className="p-button-sm p-button-success"
        onClick={() => markAsRead(rowData.id, rowData.message)}
      />
    );

  return (
    <div style={{ position: "relative" }}>
      <Button
        icon="pi pi-bell"
        label={`แจ้งเตือน`}
        className="p-button-rounded p-button-warning"
        onClick={() => setDialogVisible(true)}
      />
      {unreadCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
          }}
        >
          {unreadCount}
        </span>
      )}

      <Dialog
        header="📢 การแจ้งเตือน"
        visible={dialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setDialogVisible(false)}
      >
        <DataTable
          value={notifications}
          paginator
          rows={5}
          emptyMessage="ไม่มีการแจ้งเตือน"
        >
          <Column header="ข้อความ" body={messageTemplate} />
          <Column header="วันที่" body={dateTemplate} />
          <Column header="การกระทำ" body={actionTemplate} />
        </DataTable>
      </Dialog>
    </div>
  );
}
