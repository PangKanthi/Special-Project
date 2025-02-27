import express from 'express';
import { getAllWorkSamples, getWorkSampleById, createWorkSample, updateWorkSample, deleteWorkSample } from '../controllers/workSampleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { workSampleUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get("/", getAllWorkSamples);
router.get("/:id", getWorkSampleById);
router.post("/", authMiddleware.verifyToken, authMiddleware.isAdmin, workSampleUpload, createWorkSample);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, workSampleUpload, updateWorkSample);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.isAdmin, deleteWorkSample);

export default router;
