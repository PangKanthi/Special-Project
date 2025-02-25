import express from 'express';
import { createReview, getProductReviews, getUserReviews, deleteReview } from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/user', authMiddleware.verifyToken, getUserReviews);
router.delete('/:id', authMiddleware.verifyToken, deleteReview);

export default router;
