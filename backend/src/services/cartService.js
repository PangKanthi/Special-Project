import prisma from '../config/db.js';

class CartService {
    static async getCart(userId) {
        return await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
    }

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

        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }
        console.log("Cart ID:", cart.id);

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new Error(" สินค้าไม่พบในระบบ");
        }

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
    
    static async removeFromCart(userId, productId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");

        return await prisma.cart_item.deleteMany({
            where: { cartId: cart.id, productId }
        });
    }

    static async removeFromCartByItemId(userId, cartItemId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new Error("Cart not found");
        const cartItem = await prisma.cart_item.findUnique({ where: { id: cartItemId } });
        if (!cartItem || cartItem.cartId !== cart.id) {
            throw new Error("Item not found in user's cart");
        }

        return await prisma.cart_item.delete({
            where: { id: cartItemId }
        });
    }

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
