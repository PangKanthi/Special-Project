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
    s
    static async addToCart(userId, productId, quantity, price, color, width, length, thickness) {
        console.log(`🛒 Adding to cart - User ID: ${userId}, Product ID: ${productId}, Quantity: ${quantity}, Color: ${color}`);

        let cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        console.log("📦 Cart ID:", cart.id);

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new Error("❌ สินค้าไม่พบในระบบ");
        }

        const updatedCartItem = await prisma.cart_item.upsert({
            where: {
                cartId_productId_color_width_length_thickness: {
                    cartId: cart.id,
                    productId,
                    color: color || "default",
                    width,
                    length,
                    thickness
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
                thickness
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


    static async clearCart(userId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) throw new Error("Cart not found");

        return await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}

export default CartService;
