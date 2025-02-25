import express from 'express';
import { createWorkSample, getAllWorkSamples, deleteWorkSample } from '../controllers/workSampleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, upload.single('image'), createWorkSample);
router.get('/', getAllWorkSamples);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, deleteWorkSample);

export default router;
