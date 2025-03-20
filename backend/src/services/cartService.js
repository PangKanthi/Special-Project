// services/cartService.js

import prisma from '../config/db.js';

class CartService {
    // ดึงข้อมูลตะกร้าของ user พร้อม items
    static async getCart(userId) {
        return await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true } // ดึงข้อมูล product มาด้วย
                }
            }
        });
    }

    // เพิ่มสินค้าในตะกร้า
    static async addToCart(
        userId,
        productId,
        quantity,
        price,
        color,
        width,
        length,
        thickness,
        installOption
    ) {
        console.log(`🛒 Adding to cart - User ID: ${userId}, Product ID: ${productId}, Quantity: ${quantity}, Color: ${color}`);

        // เช็คว่าผู้ใช้มี cart แล้วหรือยัง
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }
        console.log("📦 Cart ID:", cart.id);

        // เช็คว่ามี product นี้อยู่ในระบบหรือไม่
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new Error("❌ สินค้าไม่พบในระบบ");
        }

        // upsert เพื่ออัปเดต (ถ้ามีอยู่แล้ว) หรือสร้างใหม่ (ถ้าไม่มี)
        const updatedCartItem = await prisma.cart_item.upsert({
            where: {
                cartId_productId_color_width_length_thickness_installOption: {
                    cartId: cart.id,
                    productId,
                    color: color || "default",
                    width,
                    length,
                    thickness,
                    installOption
                }
            },
            update: { quantity: { increment: quantity } },
            create: {
                cartId: cart.id,
                productId,
                quantity,
                price,
                color: color || "default",
                width,
                length,
                thickness,
                installOption
            }
        });

        return updatedCartItem;
    }

    // ลบสินค้าออกจากตะกร้า (แบบใช้ productId)
    // (อันนี้ยังใช้ได้ ถ้าต้องการลบแบบ productId ทั้งหมด)
    static async removeFromCart(userId, productId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        return await prisma.cart_item.deleteMany({
            where: { cartId: cart.id, productId }
        });
    }

    // (ใหม่) ลบสินค้าออกจากตะกร้าแบบเจาะจง cart_item.id
    static async removeFromCartByItemId(userId, cartItemId) {
        // ตรวจสอบว่ามี cart ของ user นี้ไหม
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        // ตรวจสอบว่า cart_item ดังกล่าวอยู่ใน cart ของ user นี้หรือเปล่า
        const cartItem = await prisma.cart_item.findUnique({ where: { id: cartItemId } });
        if (!cartItem || cartItem.cartId !== cart.id) {
            throw new Error("Item not found in user's cart");
        }

        // ลบสินค้า
        return await prisma.cart_item.delete({
            where: { id: cartItemId }
        });
    }

    // (ใหม่) อัปเดตจำนวนสินค้าในตะกร้า (ตาม cart_item.id)
    static async updateCartItemQuantity(userId, cartItemId, newQuantity) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        const cartItem = await prisma.cart_item.findUnique({ where: { id: cartItemId } });
        if (!cartItem || cartItem.cartId !== cart.id) {
            throw new Error("Cart item not found or does not belong to this user");
        }

        const updatedItem = await prisma.cart_item.update({
            where: { id: cartItemId },
            data: { quantity: newQuantity }
        });

        return updatedItem;
    }

    // ลบสินค้าทั้งหมดออกจากตะกร้า
    static async clearCart(userId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        console.log("🗑 ล้างตะกร้า ID:", cart.id);
        const deletedItems = await prisma.cart_item.deleteMany({
            where: { cartId: cart.id }
        });
        console.log("✅ ลบสินค้าออกจากตะกร้าทั้งหมด:", deletedItems.count);
        return deletedItems;
    }
}

export default CartService;
