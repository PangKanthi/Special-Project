import CartService from '../services/cartService.js';

export const getCart = async (req, res, next) => {
    try {
        const cart = await CartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    console.log("🛒 Adding to cart:", req.body);
    try {
        const { productId, quantity, price, color, width, length, thickness, installOption } = req.body;

        if (!productId || !quantity || !price) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        const cartItem = await CartService.addToCart(req.user.id, productId, quantity, price, color, width, length, thickness, installOption);

        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }
        await CartService.removeFromCart(req.user.id, productId);
        res.status(200).json({ message: "Removed from cart" });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        console.log("🔍 User ID ที่ส่งมา:", req.user.id);
        await CartService.clearCart(req.user.id);
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        console.error("❌ Error ในการเคลียร์ตะกร้า:", error);
        next(error);
    }
};
