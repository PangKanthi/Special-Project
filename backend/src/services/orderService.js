import fs from 'fs';
import prisma from '../config/db.js';

class OrderService {
    static async createOrder(userId, addressId, orderItems) {
        return await prisma.$transaction(async (tx) => {
            const totalAmount = orderItems.length > 0
                ? orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
                : 0;

            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total_amount: totalAmount,
                    status: 'pending',
                    order_date: new Date(),
                    payment_status: 'pending',
                    type: orderItems.length > 0 ? "purchase" : "repair"
                }
            });

            if (orderItems.length > 0) {
                const orderItemsData = orderItems.map(item => ({
                    orderId: order.id,
                    productId: item.productId,
                    installationKitId: item.installationKitId || null,
                    quantity: item.quantity,
                    price: item.price
                }));

                await tx.orderItem.createMany({ data: orderItemsData });
            }

            return order;
        });
    }


    static async getUserOrders(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: { order_items: true }
        });
    }

    static async getOrderById(orderId) {
        return await prisma.order.findUnique({
            where: { id: orderId },
            include: { order_items: true }
        });
    }

    static async uploadPaymentSlip(orderId, slipPath) {
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) }
        });

        if (!order) throw new Error("Order not found");

        if (order.payment_slip) {
            const oldFilePath = `.${order.payment_slip}`;
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        return await prisma.order.update({
            where: { id: Number(orderId) },
            data: {
                payment_slip: slipPath,
                payment_status: 'pending'
            }
        });
    }

    static async getPaymentSlip(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            select: { payment_slip: true }
        });

        if (!order) throw new Error("Order not found");

        return order.payment_slip;
    }

    static async createOrderFromCart(userId, addressId) {
        const cart = await CartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }
    
        const orderItems = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));
    
        const order = await this.createOrder(userId, addressId, orderItems);
    
        await CartService.clearCart(userId);
    
        return order;
    }
    
    static async getLatestOrder(userId) {
        return await prisma.order.findFirst({
            where: { userId },
            orderBy: { order_date: "desc" },
            include: { order_items: true }
        });
    }    
}

export default OrderService;
