import prisma from '../config/db.js';

export const getNotifications = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'A';

        const notifications = await prisma.notification.findMany({
            where: isAdmin ? {} : { userId: req.user.id },
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
        console.error(" Error updating notification:", error);
        res.status(500).json({ error: "ไม่สามารถอัปเดตการแจ้งเตือนได้" });
    }
};

export const createOutOfStockNotifications = async () => {
    try {
        const outOfStockParts = await prisma.product.findMany({
            where: {
                is_part: true,
                stock_quantity: {
                    lte: 0,
                },
            },
        });

        const adminUsers = await prisma.user.findMany({
            where: { role: 'A' },
        });

        for (const product of outOfStockParts) {
            for (const admin of adminUsers) {
                const messageText = ` อะไหล่ "${product.name}" หมดสต็อก`;

                const existing = await prisma.notification.findFirst({
                    where: {
                        userId: admin.id,
                        productId: product.id,
                        isRead: false
                    },
                });

                if (!existing) {
                    await prisma.notification.create({
                        data: {
                            userId: admin.id,
                            productId: product.id,
                            message: ` อะไหล่ "${product.name}" หมดสต็อก`,
                            isRead: false,
                        },
                    });
                }
            }
        }
    } catch (error) {
        console.error("❌ Error creating out-of-stock notifications:", error);
    }
};


