import CartService from '../services/cartService.js';

export const getCart = async (req, res, next) => {
    try {
        const cart = await CartService.getCart(req.user.id);
        res.status(200).json(cart || {});
    } catch (error) {
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    console.log(" Adding to cart:", req.body);
    try {
        const { productId, quantity, price, color, width, length, thickness, installOption } = req.body;

        if (!productId || !quantity || !price) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        const cartItem = await CartService.addToCart(
            req.user.id,
            productId,
            quantity,
            price,
            color,
            width,
            length,
            thickness,
            installOption
        );
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const { cartItemId, newQuantity } = req.body;
        if (!cartItemId || typeof newQuantity !== "number") {
            return res.status(400).json({ error: "ข้อมูล cartItemId หรือ newQuantity ไม่ถูกต้อง" });
        }

        const updatedItem = await CartService.updateCartItemQuantity(req.user.id, cartItemId, newQuantity);
        res.status(200).json({ message: "อัปเดตจำนวนสินค้าเรียบร้อย", item: updatedItem });
    } catch (error) {
        next(error);
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const { cartItemId } = req.body;
        if (!cartItemId) {
            return res.status(400).json({ error: "Cart item ID is required" });
        }

        await CartService.removeFromCartByItemId(req.user.id, cartItemId);
        res.status(200).json({ message: "Removed from cart" });
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        await CartService.clearCart(req.user.id);
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        next(error);
    }
};
