import express from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRandomProducts,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { productUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/random", getRandomProducts);
router.get("/:id", getProductById);

// หากต้องการล็อคเฉพาะแอดมินก็ใช้งาน middleware ตรวจสอบ token + role
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, productUpload, createProduct);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, productUpload, updateProduct);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteProduct);

export default router;
