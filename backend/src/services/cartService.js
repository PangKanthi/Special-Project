import prisma from '../config/db.js';

class CartService {
    static async getCart(userId) {
        return await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
    }

    /**
   * เพิ่มของลงตะกร้า
   * @param {number} userId
   * @param {number|null} productId - ถ้า null => ประตูม้วนแบบ virtual
   * @param {number} quantity
   * @param {number|null} price - ถ้าเป็นประตูและต้องการให้ Backend คำนวณเอง อาจส่ง null มาก็ได้
   * @param {string} color
   * @param {number} width
   * @param {number} length
   * @param {string} thickness
   * @param {string} installOption
   * @param {string} doorType - "MANUAL" | "CHAIN" | "ELECTRIC"
   */
    static async addToCart(
        userId,
        productId,
        quantity,
        price,
        color,
        width,
        length,
        thickness,
        installOption,
        doorType
    ) {
        // 1) หา/สร้าง cart ให้ user ก่อน
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }
        console.log("🛒 Cart ID:", cart.id);

        // 2) ถ้ามี productId => เป็นสินค้าจริงในตาราง product
        //    ถ้าไม่มี (null/undefined/0) => เป็นประตูม้วน virtual => หาราคาเองจาก JSON
        let finalPrice = price || 0; // ถ้า Frontend ส่งมาแล้ว ก็ใช้ได้เลย

        if (!productId) {
            // ประตูม้วน
            if (!doorType) {
                throw new Error("doorType is required if productId is null");
            }
            finalPrice = await this.calculateDoorPrice(doorType, thickness, width, length);
        } else {
            // เป็นสินค้าจริง => ตรวจสอบว่ามีใน DB หรือไม่
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                throw new Error("❌ สินค้าไม่พบในระบบ");
            }
        }

        // 3) upsert ลง cart_item
        const updatedCartItem = await prisma.cart_item.upsert({
            where: {
                cartId_productId_doorType_width_length_thickness_color_install: {
                    cartId: cart.id,
                    productId: productId || null,
                    doorType: doorType || null,
                    width: width || null,
                    length: length || null,
                    thickness: thickness || null,
                    color: color || "default",
                    install: installOption || null,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                cartId: cart.id,
                productId: productId || null,
                quantity,
                price: finalPrice,
                color: color || "default",
                width: width || null,
                length: length || null,
                thickness: thickness || null,
                install: installOption || null,
                doorType: doorType || null,
            },
        });

        return updatedCartItem;
    }


    /**
     * ฟังก์ชันตัวอย่าง สำหรับคำนวณราคา “ประตูม้วน” จาก JSON
     */
    static async calculateDoorPrice(doorType, thickness, width, length) {
        const doorData = doorConfig[doorType];
        if (!doorData) {
            throw new Error(`ไม่พบข้อมูลประตูม้วนชนิด ${doorType} ใน JSON`);
        }

        const area = width * length;

        // สมมติ MANUAL/CHAIN เก็บ priceTiers แบบเรียบ
        // ELECTRIC อาจต้องเช็ค priceRanges ซ้อน
        // ตัวอย่างด้านล่างเป็น logic แบบง่าย ๆ คุณต้องดัดแปลงให้ตรงกับโครงสร้างจริง

        // 1) หา tier ที่ตรงกับ thickness
        const tier = doorData.priceTiers?.find((t) => t.thickness.includes(thickness));
        if (!tier) {
            // กรณี ELECTRIC อาจไม่มี thickness ตรง ๆ แต่มี sub-array priceRanges
            // ต้องเขียนเพิ่ม logic แยก
            throw new Error(`ไม่มีการตั้งค่าราคาสำหรับความหนา ${thickness} ใน ${doorType}`);
        }

        // 2) เช็ค minArea / maxArea ถ้ามี
        if (typeof tier.minArea === "number" && area < tier.minArea) {
            throw new Error(`ขนาดพื้นที่เล็กเกินกว่าที่รองรับ (min: ${tier.minArea})`);
        }
        if (typeof tier.maxArea === "number" && area > tier.maxArea) {
            throw new Error(`ขนาดพื้นที่ใหญ่เกินกว่าที่รองรับ (max: ${tier.maxArea})`);
        }

        // 3) คำนวณราคา
        // สมมติ pricePerSqm เป็นตัวเดียว
        const finalPrice = area * tier.pricePerSqm;
        return finalPrice;
    }

    static async removeFromCart(userId, productId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        return await prisma.cart_item.deleteMany({
            where: { cartId: cart.id, productId },
        });
    }

    static async clearCart(userId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        return await prisma.cart_item.deleteMany({
            where: { cartId: cart.id },
        });
    }
}

export default CartService;
