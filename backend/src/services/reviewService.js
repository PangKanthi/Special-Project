import prisma from '../config/db.js';

class ReviewService {
    static async userHasPurchasedProduct(userId, productId) {
        return prisma.order_item.findFirst({
            where: {
                productId: productId,
                order: {
                    userId: userId
                }
            }
        }).then(item => !!item);
    }

    static async createReview(userId, productId, content, rating) {
        return await prisma.review.create({
            data: {
                userId,
                productId,
                content,
                rating: Math.max(1, Math.min(rating, 5))
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

    static async deleteReview(id) {
        return await prisma.review.delete({
            where: { id: Number(id) },
        });
    }
}

export default ReviewService;
