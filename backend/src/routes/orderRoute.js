import express from 'express';
import { createOrder } from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createOrder);

export default router;
