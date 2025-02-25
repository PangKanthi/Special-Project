import express from 'express';
import { createRepairRequest, getUserRepairRequests, getRepairRequestById } from '../controllers/repairRequestController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, createRepairRequest);
router.get('/', authMiddleware.verifyToken, getUserRepairRequests);
router.get('/:id', authMiddleware.verifyToken, getRepairRequestById);

export default router;
