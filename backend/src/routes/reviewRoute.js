import express from 'express';
import { createReview, getProductReviews, getUserReviews } from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/user', authMiddleware.verifyToken, getUserReviews);

export default router;
