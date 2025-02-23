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

export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await OrderService.getUserOrders(req.user.id);
        res.status(200).json({ message: "Get data successfully", data: orders });
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await OrderService.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.status(200).json({ message: "Get data successfully", data: order });
    } catch (error) {
        next(error);
    }
};

