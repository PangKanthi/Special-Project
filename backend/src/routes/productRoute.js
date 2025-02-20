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
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, isAdmin, createProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

router.post("/:id/add-to-kit", verifyToken, isAdmin, addProductToKit);
router.post("/:id/remove-from-kit", verifyToken, isAdmin, removeProductFromKit);

export default router;
