import OrderService from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    const { addressId, orderItems } = req.body;
    if (!addressId || !orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
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

// ตัวอย่างอัปโหลดสลิป
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

// สร้างคำสั่งซื้อจากตะกร้า
export const createOrderFromCart = async (req, res, next) => {
  try {
    const { addressId } = req.body;
    if (!addressId) {
      return res.status(400).json({ error: "Address ID is required" });
    }

    const order = await OrderService.createOrderFromCart(req.user.id, addressId);
    res.status(201).json(order);
  } catch (error) {
    console.error("[ERROR] createOrderFromCart failed:", error);
    res.status(500).json({ error: "Failed to create order from cart" });
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
