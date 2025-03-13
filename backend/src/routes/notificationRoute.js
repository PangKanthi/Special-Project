// routes/notificationRoute.js
import express from 'express';
import { createNotification, getNotifications, markAsRead, deleteNotification } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// สร้างแจ้งเตือน (ต้องเป็น Admin ในตัวอย่างนี้)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, createNotification);

// ดึงการแจ้งเตือน (Admin = ทั้งหมด, User = ของตัวเอง)
router.get('/', authMiddleware.verifyToken, getNotifications);

// อัปเดตสถานะเป็น "อ่านแล้ว"
router.patch('/:id/read', authMiddleware.verifyToken, markAsRead);

// ลบแจ้งเตือน
router.delete('/:id', authMiddleware.verifyToken, deleteNotification);

export default router;
