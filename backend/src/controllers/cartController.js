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
    try {
        const {
            productId,
            quantity,
            price,
            color,
            width,
            length,
            thickness,
            installOption,
            doorType,
        } = req.body;

        // ถ้าเป็นประตู => productId จะเป็น null
        // แต่เราต้องตรวจว่ามี doorType / dimension ครบไหม
        // ส่วนกรณีสินค้า => productId ต้องไม่ null
        if (!quantity) {
            return res.status(400).json({ error: "quantity is required" });
        }
        // สมมติถ้ายังต้องการให้ส่ง price มาด้วย (กรณีอะไหล่)
        // หรือจะให้ Backend คำนวณเสมอก็ได้ แล้วแต่

        const cartItem = await CartService.addToCart(
            req.user.id,
            productId ? parseInt(productId, 10) : null,
            parseInt(quantity, 10),
            price ? parseFloat(price) : null,
            color,
            width ? parseFloat(width) : null,
            length ? parseFloat(length) : null,
            thickness,
            installOption,
            doorType
        );

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
        await CartService.clearCart(req.user.id);
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        next(error);
    }
};
