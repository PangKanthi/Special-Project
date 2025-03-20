// routes/cartRoute.js

import express from 'express';
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem
} from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// ดึงข้อมูลตะกร้า
router.get('/', authMiddleware.verifyToken, getCart);

// เพิ่มสินค้า
router.post('/add', authMiddleware.verifyToken, addToCart);

// (ใหม่) อัปเดตจำนวนสินค้า
router.patch('/update', authMiddleware.verifyToken, updateCartItem);

// (แก้ใหม่) ลบสินค้าออกจากตะกร้า ตาม cartItemId
router.post('/remove', authMiddleware.verifyToken, removeFromCart);

// ลบสินค้าทั้งหมดออกจากตะกร้า
router.post('/clear', authMiddleware.verifyToken, clearCart);

export default router;
