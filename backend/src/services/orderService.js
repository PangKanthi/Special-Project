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
                    total_amount: 0,
                    status: 'pending',
                    payment_status: 'pending'
                }
            });

            const cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

            const totalAmount = cart.items.reduce((acc, item) => {
                return acc + Number(item.price ?? 0) * Number(item.quantity ?? 1);
            }, 0);

            await tx.order.update({
                where: { id: order.id },
                data: { total_amount: totalAmount }
            });

            await tx.order_item.createMany({
                data: cart.items.map((item) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,

                    color: item.color,
                    width: item.width,
                    length: item.length,
                    thickness: item.thickness,
                    installOption: item.installOption
                }))
            });
            await tx.cart_item.deleteMany({ where: { cartId: cart.id } });
            return order;
        });
    }

    static async getUserOrders(userId) {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                user: { 
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
        return prisma.order.findUnique({
            where: { id: Number(orderId) },
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

        const orderId = updatedItem.orderId;

        const items = await prisma.order_item.findMany({
            where: { orderId },
        });

        let newTotal = 0;
        items.forEach((itm) => {
            const qty = Number(itm.quantity ?? 0);
            const prc = Number(itm.price ?? 0);
            newTotal += qty * prc;
        });

        await prisma.order.update({
            where: { id: orderId },
            data: { total_amount: newTotal }
        });

        return updatedItem;
    }

    static async addProductToOrder(orderId, productId, quantity) {
        if (!orderId || !productId || quantity <= 0) {
            throw new Error("Invalid orderId, productId or quantity");
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new Error("Order not found");
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new Error("Product not found");
        }

        const price = product.price;

        const newOrderItem = await prisma.order_item.create({
            data: {
                orderId: orderId,
                productId: productId,
                quantity: quantity,
                price: price,
            },
        });

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                total_amount: { increment: price * quantity },
            },
        });

        return updatedOrder;
    }

    static async removeProductFromOrder(orderId, orderItemId) {  
        try {  
            console.log("Received orderId:", orderId, "type:", typeof orderId);  
            console.log("Received orderItemId:", orderItemId, "type:", typeof orderItemId);  
    
            // Parameter validation  
            if (!orderId || !orderItemId) {  
                throw new Error(`Missing required parameters. OrderId: ${orderId}, OrderItemId: ${orderItemId}`);  
            }
    
            // Parse IDs  
            const orderItemInt = parseInt(orderItemId, 10);  
            const orderInt = parseInt(orderId, 10);  
    
            console.log("Parsed orderInt:", orderInt, "isNaN:", isNaN(orderInt));  
            console.log("Parsed orderItemInt:", orderItemInt, "isNaN:", isNaN(orderItemInt));  
    
            if (isNaN(orderItemInt) || isNaN(orderInt)) {  
                throw new Error(`Invalid ID format. OrderId: ${orderId}, OrderItemId: ${orderItemId}`);  
            }  
    
            // Find the order item  
            const orderItem = await prisma.order_item.findUnique({  
                where: { id: orderItemInt },  
            });  
    
            if (!orderItem) {  
                throw new Error(`Order item not found with ID: ${orderItemInt}`);  
            }  
    
            // Delete the order item  
            await prisma.order_item.delete({  
                where: { id: orderItemInt },  
            });  
    
            // Update the order total  
            const updatedOrder = await prisma.order.update({  
                where: { id: orderInt },  
                data: {  
                    total_amount: { decrement: orderItem.price * orderItem.quantity }  
                }  
            });  
    
            return updatedOrder;  
        } catch (error) {  
            console.error("Error removing product from order:", error);  
            throw error; // Re-throw to allow calling code to handle the error  
        }  
    }  

}

export default OrderService;
