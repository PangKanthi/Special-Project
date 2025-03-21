import prisma from '../config/db.js';

class ReviewService {
    // เช็กว่าผู้ใช้คนนี้เคยซื้อสินค้านั้นไหม
    static async userHasPurchasedProduct(userId, productId) {
        return prisma.order_item.findFirst({
            where: {
                productId: productId,  // หรือ Number(productId) เผื่อกันพลาดซ้ำ
                order: {
                    userId: userId       // userId จาก req.user.id มักเป็น number อยู่แล้ว
                }
            }
        }).then(item => !!item);
    }

    // สร้างรีวิว
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

    // ดึงรีวิวจาก productId
    static async getProductReviews(productId) {
        return await prisma.review.findMany({
            where: { productId },
            include: { user: true }
        });
    }

    // ดึงรีวิวทั้งหมดของ userId
    static async getUserReviews(userId) {
        return await prisma.review.findMany({
            where: { userId },
            include: { product: true }
        });
    }

    // ลบรีวิว
    static async deleteReview(id) {
        return await prisma.review.delete({
            where: { id: Number(id) },
        });
    }
}

export default ReviewService;
