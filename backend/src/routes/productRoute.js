import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getRandomProducts, getAllParts, getPriceTiers, addPriceTier, updatePriceTier, deletePriceTier, setBomItems, getBomItems } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { productUpload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/random", getRandomProducts);
router.get("/parts", getAllParts);
router.get("/:id", getProductById);
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, productUpload, createProduct);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, productUpload, updateProduct);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteProduct);
router.get("/:id/price-tiers", getPriceTiers);
router.post("/:id/price-tiers", authMiddleware.verifyToken, authMiddleware.isAdmin, addPriceTier);
router.patch("/price-tiers/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, updatePriceTier);
router.delete("/price-tiers/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deletePriceTier);
router.post("/:id/bom", authMiddleware.verifyToken, authMiddleware.isAdmin, setBomItems);
router.get("/:id/bom", getBomItems);

export default router;
