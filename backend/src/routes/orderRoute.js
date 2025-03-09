import express from 'express';
import { createOrder, getUserOrders, getOrderById, createOrderFromCart, getLatestOrder } from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { uploadPaymentSlip, getPaymentSlip } from '../controllers/orderController.js';
import { slipUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createOrder);
router.get('/user', authMiddleware.verifyToken, getUserOrders);
router.get('/:id', authMiddleware.verifyToken, getOrderById);
router.post('/from-cart', authMiddleware.verifyToken, createOrderFromCart);
router.get('/latest', authMiddleware.verifyToken, getLatestOrder);

router.post('/:id/upload-slip', authMiddleware.verifyToken, slipUpload, uploadPaymentSlip);
router.get('/:id/payment-slip', authMiddleware.verifyToken, getPaymentSlip);

export default router;