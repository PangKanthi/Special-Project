import express from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createOrder);
router.get('/user', authMiddleware.verifyToken, getUserOrders);
router.get('/:id', authMiddleware.verifyToken, getOrderById);

export default router;
