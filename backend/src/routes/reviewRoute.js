import express from 'express';
import {
    createReview,
    getProductReviews,
    getUserReviews,
    deleteReview
} from '../controllers/reviewController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// สร้างรีวิว -> ต้องล็อกอิน
router.post('/', authMiddleware.verifyToken, createReview);

// ดูรีวิวของสินค้าตาม productId -> ไม่จำเป็นต้องล็อกอินก็ได้ (แล้วแต่ requirement)
router.get('/product/:productId', getProductReviews);

// ดูรีวิวของ user -> ต้องล็อกอิน
router.get('/user', authMiddleware.verifyToken, getUserReviews);

// ลบรีวิว -> ต้องล็อกอิน
router.delete('/:id', authMiddleware.verifyToken, deleteReview);

export default router;
