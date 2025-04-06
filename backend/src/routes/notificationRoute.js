import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authMiddleware.verifyToken, getNotifications);
router.put('/:id/read', authMiddleware.verifyToken, markNotificationAsRead);

export default router;
