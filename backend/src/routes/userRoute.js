import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, authMiddleware.isAdmin, getAllUsers);
router.get("/:id", authMiddleware.verifyToken, getUserById);
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, createUser);
router.put("/:id", authMiddleware.verifyToken, updateUser);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteUser);

export default router;
