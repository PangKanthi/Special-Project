import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, requestPasswordReset, resetPassword,getUserProfile,changeUserPassword, updateUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware.verifyToken, authMiddleware.isAdmin, getAllUsers);

router.get("/me", authMiddleware.verifyToken, getUserProfile);
router.put("/me/password", authMiddleware.verifyToken, changeUserPassword);
router.get("/get/:id", authMiddleware.verifyToken, getUserById);
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, createUser);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.put("/:id", authMiddleware.verifyToken, updateUser);

router.put("/me/profile", authMiddleware.verifyToken, updateUserProfile);

export default router;
