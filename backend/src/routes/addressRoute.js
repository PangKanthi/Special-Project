import express from "express";
import {
  getAddresses,
  addAddress,
  modifyAddress,
  removeAddress,
} from "../controllers/addressController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, getAddresses);
router.post("/", authMiddleware.verifyToken, addAddress);
router.put("/:id", authMiddleware.verifyToken, modifyAddress);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, removeAddress);

export default router;
