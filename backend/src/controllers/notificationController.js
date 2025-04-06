import prisma from '../config/db.js';

export const getNotifications = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'A';

        const notifications = await prisma.notification.findMany({
            where: isAdmin ? {} : { userId: req.user.id }, // 👈 แอดมินเห็นทั้งหมด
            orderBy: { createdAt: 'desc' }
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: "ไม่สามารถดึงการแจ้งเตือนได้" });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        await prisma.notification.update({
            where: { id: Number(req.params.id) },
            data: { isRead: true }
        });
        res.json({ message: "อัปเดตสถานะเป็นอ่านแล้ว" });
    } catch (error) {
        console.error("❌ Error updating notification:", error);
        res.status(500).json({ error: "ไม่สามารถอัปเดตการแจ้งเตือนได้" });
    }
};
