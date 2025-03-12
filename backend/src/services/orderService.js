import fs from 'fs';
import prisma from '../config/db.js';
import CartService from './cartService.js';

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
        try {
            console.log("📌 Checking addressId:", addressId);

            if (!addressId) {
                throw new Error("Address ID is missing");
            }

            const addressExists = await prisma.address.findUnique({
                where: { id: addressId },
            });

            console.log("📌 Address found:", addressExists);

            if (!addressExists) {
                throw new Error(`Address ID ${addressId} not found`);
            }

            const cart = await CartService.getCart(userId);
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            const orderItems = cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                installOption: item.installOption || "",
            }));

            const order = await this.createOrder(userId, addressId, orderItems);
            await CartService.clearCart(userId);
            return order;
        } catch (error) {
            console.error("[ERROR] Failed to create order from cart:", error);
            throw new Error("Failed to create order from cart");
        }
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
