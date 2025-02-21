import OrderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
    try {
        const { addressId, orderItems } = req.body;
        if (!addressId || !orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
        }

        const order = await OrderService.createOrder(req.user.id, addressId, orderItems);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};
