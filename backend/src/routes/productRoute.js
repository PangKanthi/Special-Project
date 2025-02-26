import express from "express";
import { createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { productUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, productUpload, createProduct);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, productUpload, updateProduct);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteProduct);

export default router;
