import fs from 'fs';
import prisma from '../config/db.js';
import CartService from './cartService.js';
import doorConfig from "../config/doorConfig.json" assert { type: "json" };
import NotificationService from './notificationService.js';

class OrderService {
    static async createOrder(userId, addressId, orderItems) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total_amount: 0,
                    status: 'pending',
                    payment_status: 'pending'
                }
            });

            // 👇 แจ้งเตือนว่ามี Order ใหม่
            await NotificationService.createNotification({
                message: `มีออเดอร์ใหม่จาก User ID #${userId}, Order ID #${order.id}`,
                type: 'ORDER'
            });

            if (updatedPart.stock_quantity <= 10 && updatedPart.stock_quantity > 0) {
                await NotificationService.createNotification({
                    message: `อะไหล่ ${updatedPart.name} (ID: ${updatedPart.id}) ใกล้หมด เหลือ ${updatedPart.stock_quantity} ชิ้น`,
                    type: 'STOCK'
                });
            } else if (updatedPart.stock_quantity === 0) {
                await NotificationService.createNotification({
                    message: `อะไหล่ ${updatedPart.name} (ID: ${updatedPart.id}) หมดสต็อก!`,
                    type: 'STOCK'
                });
            } else if (updatedPart.stock_quantity < 0) {
                await NotificationService.createNotification({
                    message: `อะไหล่ ${updatedPart.name} (ID: ${updatedPart.id}) สต็อกติดลบ: ${updatedPart.stock_quantity}`,
                    type: 'STOCK'
                });
            }
            return order;
        });
    }

    static async getAllOrders() {
        return await prisma.order.findMany({
            include: {
                order_items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: { username: true }
                },
                address: true
            },
        });
    }
    
    static async updateOrderStatus(orderId, status) {
        return await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
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

    static async getLatestOrder(userId) {
        return await prisma.order.findFirst({
            where: { userId },
            orderBy: { order_date: "desc" },
            include: { order_items: true }
        });
    }
}

export default OrderService;
