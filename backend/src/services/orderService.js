import fs from 'fs';
import prisma from '../config/db.js';
import CartService from './cartService.js';
const rawData = fs.readFileSync("src/config/doorConfig.json", "utf-8");
const doorConfig = JSON.parse(rawData);
class OrderService {
    static async createOrder(userId, addressId, orderItems, totalAmount) {
        return await prisma.$transaction(async (tx) => {
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

                        // เพิ่มคอลัมน์ที่ใหม่
                        color: item.color || null,
                        width: item.width,
                        length: item.length,
                        thickness: item.thickness,
                        installOption: item.installOption
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
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                category: true,
                                // 🟢 ต้องเพิ่ม "colors" มาด้วย
                                colors: true
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
        return await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
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
