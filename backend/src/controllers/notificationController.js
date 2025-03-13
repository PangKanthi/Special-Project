// controllers/notificationController.js
import NotificationService from '../services/notificationService.js';

export const createNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        const notification = await NotificationService.createNotification({ userId, message, type });
        return res.status(201).json({ message: "สร้างการแจ้งเตือนสำเร็จ", data: notification });
    } catch (error) {
        console.error("❌ Error creating notification:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการสร้างการแจ้งเตือน" });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const { role, id: userId } = req.user;
        let data;

        // ถ้าเป็น Admin ให้ดึงทุกแจ้งเตือน ถ้าเป็น User ให้ดึงเฉพาะของตนเอง
        if (role === 'A') {
            data = await NotificationService.getNotifications();
        } else {
            data = await NotificationService.getNotifications({ userId });
        }

        return res.status(200).json({ data });
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงการแจ้งเตือน" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await NotificationService.markAsRead(parseInt(id, 10));
        return res.status(200).json({ message: "อัปเดตสถานะแจ้งเตือนเป็นอ่านแล้ว", data: notification });
    } catch (error) {
        console.error("❌ Error marking notification:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตสถานะแจ้งเตือน" });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await NotificationService.deleteNotification(parseInt(id, 10));
        return res.status(200).json({ message: "ลบแจ้งเตือนสำเร็จ" });
    } catch (error) {
        console.error("❌ Error deleting notification:", error);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบแจ้งเตือน" });
    }
};
