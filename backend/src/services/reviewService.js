import prisma from '../config/db.js';

class ReviewService {
    static async createReview(userId, productId, content, rating) {
        return await prisma.review.create({
            data: {
                userId,
                productId,
                content,
                rating: Math.max(1, Math.min(rating, 5)) // จำกัดคะแนนระหว่าง 1-5
            }
        });
    }

    static async getProductReviews(productId) {
        return await prisma.review.findMany({
            where: { productId },
            include: { user: true }
        });
    }

    static async getUserReviews(userId) {
        return await prisma.review.findMany({
            where: { userId },
            include: { product: true }
        });
    }
}

export default ReviewService;
