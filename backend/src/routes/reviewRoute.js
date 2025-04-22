import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  deleteReview,
  getAllReviews
} from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/me', authMiddleware.verifyToken, getUserReviews);
router.delete('/:id', authMiddleware.verifyToken, deleteReview);
router.get('/admin/all', authMiddleware.verifyToken, getAllReviews);

export default router;
