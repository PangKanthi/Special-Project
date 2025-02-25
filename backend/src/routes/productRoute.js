import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductToKit,
  removeProductFromKit
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, createProduct);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, updateProduct);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteProduct);

router.post("/:id/add-to-kit", authMiddleware.verifyToken, authMiddleware.isAdmin, addProductToKit);
router.post("/:id/remove-from-kit", authMiddleware.verifyToken, authMiddleware.isAdmin, removeProductFromKit);

export default router;
