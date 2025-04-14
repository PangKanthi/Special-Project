import fs from 'fs';
import prisma from '../config/db.js';
import CartService from './cartService.js';
import { createOutOfStockNotifications } from '../controllers/notificationController.js';
const rawData = fs.readFileSync("src/config/doorConfig.json", "utf-8");
const doorConfig = JSON.parse(rawData);
class OrderService {
    static async createOrder(userId, addressId, orderItems, totalAmount) {
        const order = await prisma.$transaction(async (tx) => {
            // 1) สร้าง order
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total_amount: totalAmount,
                    status: 'pending',
                    payment_status: 'pending'
                }
            });

            // 2) สร้าง order_item
            if (orderItems.length > 0) {
                await tx.order_item.createMany({
                    data: orderItems.map((item) => ({
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        color: item.color || null,
                        width: item.width,
                        length: item.length,
                        thickness: item.thickness,
                        installOption: item.installOption
                    }))
                });
            }

            // ไม่ต้องลดจำนวนอะไหล่ในขั้นตอน createOrder

            return order;
        });
    }


    static async getAllOrders() {
        const orders = await prisma.order.findMany({
            include: {
                order_items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                category: true,
                                colors: true,
                                warranty: true
                            }
                        }
                    }
                },
                user: { select: { id: true, firstname: true, lastname: true, phone: true } },
                address: true
            }
        });
        return orders;
    }

    static async deleteOrder(orderId) {
        return await prisma.order.delete({
            where: { id: orderId },
        });
    }

    static async updateOrderStatus(orderId, status) {
        let updatedOrder;

        await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { order_items: { include: { product: true } } }
            });

            if (!order) throw new Error("Order not found");

            const updateData = { status };
            if (status === "complete") {
                updateData.completedAt = new Date();
            }

            updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: updateData
            });

            if (status === "complete") {
                for (const item of order.order_items) {
                    const product = item.product;
                    if (product.is_part) {
                        await tx.product.update({
                            where: { id: product.id },
                            data: {
                                stock_quantity: { decrement: item.quantity }
                            }
                        });
                    } else {
                        const bomItems = await tx.bom_item.findMany({
                            where: { productId: product.id },
                            include: { part: true }
                        });
                        for (const bom of bomItems) {
                            const requiredQty = item.quantity * bom.quantity;
                            if (bom.part) {
                                await tx.product.update({
                                    where: { id: bom.part.id },
                                    data: { stock_quantity: { decrement: requiredQty } }
                                });
                            }
                        }
                    }
                }
            }
        });

        if (status === "complete") {
            await createOutOfStockNotifications();
        }

        return updatedOrder;
    }



    static async createOrderFromCart(userId, addressId) {
        return await prisma.$transaction(async (tx) => {
            // 1) สร้าง order
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    total_amount: 0,  // หรือคำนวณจริง ๆ
                    status: 'pending',
                    payment_status: 'pending'
                }
            });

            // 2) ดึง cart + items
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

            // (ตัวอย่าง) คำนวณ total_amount
            const totalAmount = cart.items.reduce((acc, item) => {
                return acc + Number(item.price ?? 0) * Number(item.quantity ?? 1);
            }, 0);

            // 3) อัปเดต order ให้เก็บ total_amount ที่คำนวณ
            await tx.order.update({
                where: { id: order.id },
                data: { total_amount: totalAmount }
            });

            // 4) ย้าย cart_item -> order_item
            await tx.order_item.createMany({
                data: cart.items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,

                    // จัดการคอลัมน์ใหม่
                    color: item.color,
                    width: item.width,
                    length: item.length,
                    thickness: item.thickness,
                    installOption: item.installOption
                }))
            });

            // 5) ล้างตะกร้าหรือปล่อยไว้ก็ได้
            await tx.cart_item.deleteMany({ where: { cartId: cart.id } });

            // 6) return order
            return order;
        });
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

    static async updateOrderItem(
        orderItemId,
        productId,
        quantity,
        price,
        color,
        width,
        length,
        thickness,
        installOption
    ) {
        // 1) update ตัว order_item ก่อน
        const updatedItem = await prisma.order_item.update({
            where: { id: orderItemId },
            data: {
                productId,
                quantity,
                price,
                color,
                width,
                length,
                thickness,
                installOption
            }
        });

        // 2) หา orderId ที่ item ตัวนี้สังกัด
        const orderId = updatedItem.orderId;

        // 3) คำนวณ new total 
        //    ดึงทุก item ของ orderId นี้
        const items = await prisma.order_item.findMany({
            where: { orderId },
        });

        // รวม quantity * price
        let newTotal = 0;
        items.forEach((itm) => {
            const qty = Number(itm.quantity ?? 0);
            const prc = Number(itm.price ?? 0);
            newTotal += qty * prc;
        });

        // 4) update order.total_amount
        await prisma.order.update({
            where: { id: orderId },
            data: { total_amount: newTotal }
        });

        // 5) return updatedItem
        return updatedItem;
    }

}

export default OrderService;
