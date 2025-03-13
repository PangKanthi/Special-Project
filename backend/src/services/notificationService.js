// services/notificationService.js
import prisma from '../config/db.js';

class NotificationService {
    static async createNotification({ userId, message, type }) {
        return prisma.notification.create({
            data: {
                userId,
                message,
                type
            }
        });
    }

    static async getNotifications({ userId = null } = {}) {
        const whereClause = userId ? { userId } : {};
        return prisma.notification.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    static async markAsRead(notificationId) {
        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }

    static async deleteNotification(notificationId) {
        return prisma.notification.delete({
            where: { id: notificationId }
        });
    }
}

export default NotificationService;
