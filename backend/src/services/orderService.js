import fs from 'fs';
import prisma from '../config/db.js';
import CartService from './cartService.js';
import NotificationService from './notificationService.js';

class OrderService {
    static async createOrder(userId, addressId, orderItems, totalAmount) {
        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total_amount: totalAmount,
                    status: 'pending',
                    payment_status: 'pending'
                }
            });

            if (orderItems.length > 0) {
                await tx.order_item.createMany({
                    data: orderItems.map(item => ({
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            }

            for (const item of orderItems) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (["manual_rolling_shutter", "chain_electric_shutter", "electric_rolling_shutter"]
                    .includes(product.category)) {

                    const bomData = doorConfig[product.category]?.bom;
                    if (!bomData) {
                        console.log(`❌ ไม่เจอ bom ใน doorConfig ของ category = ${product.category}`);
                        continue;
                    }

                    for (const bomItem of bomData) {

                        const qtyBom = parseInt(bomItem.quantity, 10);
                        const qtyOrder = parseInt(item.quantity, 10);

                        if (isNaN(qtyBom) || isNaN(qtyOrder)) {
                            console.log(`❌ quantity (${bomItem.quantity}) หรือ item.quantity (${item.quantity}) ไม่เป็นตัวเลข`);
                            continue;
                        }

                        const totalUsed = qtyBom * qtyOrder;

                        const partProduct = await tx.product.findFirst({
                            where: {
                                category: bomItem.part,
                                is_part: true
                            }
                        });

                        if (!partProduct) {
                            console.log(`❌ ไม่พบอะไหล่ชื่อ ${bomItem.part} ใน DB`);
                            continue;
                        }

                        await tx.product.update({
                            where: { id: partProduct.id },
                            data: {
                                stock_quantity: {
                                    decrement: totalUsed
                                }
                            }
                        });

                        console.log(`✅ ลดสต็อก ${bomItem.part} จำนวน ${totalUsed} หน่วย`);
                    }

                } else if (product.is_part) {
                    await tx.product.update({
                        where: { id: product.id },
                        data: {
                            stock_quantity: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
            }
            return order;
        });
    }
    
    static async getAllOrders() {
        const orders = await prisma.order.findMany({
            include: {
                order_items: {
                    include: {
                        product: { select: { id: true, name: true, images: true, category: true } } // ✅ เพิ่ม category
                    }
                },
                user: { select: { id: true, firstname: true, lastname: true, phone: true } },
                address: true
            }
        });

        console.log("📌 Orders from DB (with category):", JSON.stringify(orders, null, 2)); // ✅ Debug JSON
        return orders;
    }

    static async deleteOrder(orderId) {
        return await prisma.order.delete({
            where: { id: orderId },
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
            include: {
                user: {  // ✅ เพิ่มข้อมูล user
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        phone: true
                    }
                },
                address: true,
                order_items: {
                    include: {
                        product: {
                            select: { id: true, name: true, images: true, category: true }
                        }
                    }
                }
            }
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

    static async updateOrderItem(orderItemId, newProductId, newQuantity, newPrice) {
        return await prisma.order_item.update({
            where: { id: orderItemId },
            data: {
                productId: newProductId,
                quantity: newQuantity,
                price: newPrice
            }
        });
    }
    
}

export default OrderService;
