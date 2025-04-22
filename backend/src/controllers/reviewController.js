import ReviewService from '../services/reviewService.js';
import prisma from '../config/db.js';

export const createReview = async (req, res, next) => {
  try {
    const { productId, content, rating } = req.body;
    if (!productId || !content || rating === undefined) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }

    const productIdNum = Number(productId);

    const hasPurchased = await ReviewService.userHasPurchasedProduct(
      req.user.id,
      productIdNum
    );
    if (!hasPurchased) {
      return res.status(400).json({ error: "คุณยังไม่ได้ซื้อสินค้าชิ้นนี้ จึงไม่สามารถรีวิวได้" });
    }

    const review = await ReviewService.createReview(
      req.user.id,
      productIdNum,
      content,
      rating
    );

    res.status(201).json(review);
  } catch (error) {
    console.error("ERROR in createReview:", error);
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    console.log("==== [getProductReviews] productId param:", req.params.productId);

    const prodId = Number(req.params.productId);
    console.log("==== [getProductReviews] productId (as number):", prodId);

    const reviews = await ReviewService.getProductReviews(prodId);
    console.log("==== [getProductReviews] Prisma result:", reviews);

    return res.status(200).json({ message: "Get data successfully", data: reviews });
  } catch (error) {
    console.error("==== [getProductReviews] Error:", error);
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    if (req.user.role !== 'A') {
      return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: true,
        product: true
      },
      orderBy: { id: 'desc' }
    });

    res.status(200).json({ message: "ดึงรีวิวทั้งหมดสำเร็จ", data: reviews });
  } catch (error) {
    console.error(" ERROR getAllReviews:", error);
    next(error);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewService.getUserReviews(req.user.id);
    res.status(200).json({ message: "Get data successfully", data: reviews });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.id);
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: 'ไม่พบรีวิวที่ต้องการลบ' });
    }

    if (req.user.role !== 'A' && review.userId !== req.user.id) {
      return res.status(403).json({ error: 'คุณไม่มีสิทธิ์ลบรีวิวนี้' });
    }

    await ReviewService.deleteReview(reviewId);
    return res.json({ message: 'ลบรีวิวเรียบร้อยแล้ว' });

  } catch (error) {
    next(error);
  }
};
