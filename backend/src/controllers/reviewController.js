import ReviewService from '../services/reviewService.js';

export const createReview = async (req, res, next) => {
    try {
        const { productId, content, rating } = req.body;
        
        if (!productId || !content || rating === undefined) {
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
        }

        const review = await ReviewService.createReview(
            req.user.id,
            productId,
            content,
            rating
        );

        res.status(201).json(review);
    } catch (error) {
        next(error);
    }
};

export const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await ReviewService.getProductReviews(req.params.productId);
        res.status(200).json({ message: "Get data successfully", data: reviews });
    } catch (error) {
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
        await ReviewService.deleteReview(req.params.id);
        res.json({ message: "ลบรีวิวเรียบร้อยแล้ว" });
    } catch (error) {
        next(error);
    }
};
