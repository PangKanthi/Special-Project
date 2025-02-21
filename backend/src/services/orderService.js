import prisma from '../config/db.js';

class OrderService {
    static async createOrder(userId, addressId, orderItems) {
        return await prisma.$transaction(async (tx) => {
            const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    totalAmount,
                    status: 'pending',
                    order_date: new Date(),
                    payment_status: 'pending'
                }
            });

            const orderItemsData = orderItems.map(item => ({
                orderId: order.id,
                productId: item.productId,
                installationKitId: item.installationKitId || null,
                quantity: item.quantity,
                price: item.price
            }));

            await tx.orderItem.createMany({ data: orderItemsData });

            return order;
        });
    }

    static async getOrdersByUser(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: { order_items: true }
        });
    }
}

export default OrderService;
