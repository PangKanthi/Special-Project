import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware.verifyToken, getCart);
router.post('/add', authMiddleware.verifyToken, addToCart);
router.post('/remove', authMiddleware.verifyToken, removeFromCart);
router.post('/clear', authMiddleware.verifyToken, clearCart);

export default router;
