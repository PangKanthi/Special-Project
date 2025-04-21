import OrderService from '../services/orderService.js';
import prisma from '../config/db.js';

export const createOrder = async (req, res, next) => {
    try {
        const { addressId, orderItems, totalAmount, firstname, lastname } = req.body;
        const userId = req.user.id;

        // Validation เบื้องต้น
        if (!addressId || !orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
        }

        // เรียกใช้ Service
        const order = await OrderService.createOrder(
            req.user.id,
            addressId,
            orderItems,  // <-- array ของ { productId, quantity, price, color, width, ... }
            totalAmount
        );

        await prisma.notification.create({
            data: {
                userId,
                message: `📦 มีคำสั่งซื้อใหม่จากผู้ใช้ ${firstname} ${lastname} มูลค่า ${totalAmount}`
            }
        });

        res.status(201).json({
            message: "สั่งซื้อสำเร็จ",
            data: order
        });
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

export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedOrder = await OrderService.deleteOrder(parseInt(id));

        if (!deletedOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully", data: deletedOrder });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await OrderService.getAllOrders(); // เรียกใช้ service ที่เราจะสร้าง
        res.status(200).json({ message: "Get all orders successfully", data: orders });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updatedOrder = await OrderService.updateOrderStatus(parseInt(id), status);

        res.status(200).json({ message: "Order status updated", data: updatedOrder });
    } catch (error) {
        next(error);
    }
};

export const uploadPaymentSlip = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "กรุณาอัปโหลดไฟล์สลิปโอนเงิน" });
        }

        const slipPath = `/uploads/slips/${req.file.filename}`;
        const updatedOrder = await OrderService.uploadPaymentSlip(req.params.id, slipPath);

        res.status(200).json({ message: "อัปโหลดสลิปสำเร็จ", order: updatedOrder });
    } catch (error) {
        next(error);
    }
};

export const getPaymentSlip = async (req, res, next) => {
    try {
        const slipPath = await OrderService.getPaymentSlip(req.params.id);
        if (!slipPath) {
            return res.status(404).json({ error: "ไม่พบสลิปโอนเงิน" });
        }

        res.status(200).json({ payment_slip: slipPath });
    } catch (error) {
        next(error);
    }
};

export const createOrderFromCart = async (req, res, next) => {
    try {
        const { addressId } = req.body;
        if (!addressId) {
            return res.status(400).json({ error: "Address ID is required" });
        }

        const order = await OrderService.createOrderFromCart(req.user.id, addressId);

        res.status(201).json({
            message: "สร้างออเดอร์จากตะกร้าสำเร็จ",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const getLatestOrder = async (req, res, next) => {
    try {
        const order = await OrderService.getLatestOrder(req.user.id);
        if (!order) return res.status(404).json({ error: "No orders found" });

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const updateOrderItem = async (req, res, next) => {
    try {
        const {
            orderItemId,
            productId,
            quantity,
            price,
            color,
            width,
            length,
            thickness,
            installOption
        } = req.body;

        // ถ้าต้องการ validate เบื้องต้นเพิ่มเติมก็สามารถใส่ได้
        if (!orderItemId || !productId || !quantity || !price) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        const updatedOrderItem = await OrderService.updateOrderItem(
            orderItemId,
            productId,
            quantity,
            price,
            color,
            width,
            length,
            thickness,
            installOption
        );

        res.status(200).json({
            message: "อัปเดตรายการสินค้าในออเดอร์สำเร็จ",
            data: updatedOrderItem
        });
    } catch (error) {
        next(error);
    }
};

export const addProductToOrder = async (req, res) => {
    const { productId, quantity } = req.body;
    const { id } = req.params;           // ← เปลี่ยนจาก orderId เป็น id
    const orderId = Number(id);          // แปลงเป็นตัวเลขไว้เลยถ้าต้องใช้ Int

    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
    }
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "Invalid productId or quantity" });
    }

    try {
        const order = await OrderService.addProductToOrder(orderId, productId, quantity);
        return res.status(200).json({ message: "Product added", orderItems: order.order_items });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add product" });
    }
};

export const removeProductFromOrder = async (req, res, next) => {
    try {
        const { orderItemId, orderId } = req.params;
        console.log(`Removing product from order: orderId=${orderId}, orderItemId=${orderItemId}`); // Debugging line

        const updatedOrder = await OrderService.removeProductFromOrder(orderId, orderItemId);
        res.status(200).json({ message: "Product removed", orderItems: updatedOrder.order_items });
    } catch (error) {
        next(error);
    }
};

export const checkPurchased = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId);

        // findFirst ดูว่า userId == req.user.id
        // และ productId == productId หรือเปล่า
        const purchased = await prisma.order_item.findFirst({
            where: {
                productId,
                order: {
                    userId: req.user.id,
                },
            },
        });

        // ถ้า purchased เจอ (ไม่เป็น null/undefined) แสดงว่าเคยซื้อ
        const hasPurchased = !!purchased;

        return res.json({ hasPurchased });
    } catch (error) {
        next(error);
    }
};



