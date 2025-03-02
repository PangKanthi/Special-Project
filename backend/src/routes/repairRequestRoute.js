import express from 'express';
import { 
    createRepairRequest, 
    getUserRepairRequests, 
    getRepairRequestById, 
    updateRepairRequest, 
    deleteRepairRequest 
} from '../controllers/repairRequestController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { repairRequestUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, repairRequestUpload, createRepairRequest);
router.get('/', authMiddleware.verifyToken, getUserRepairRequests);
router.get('/:id', authMiddleware.verifyToken, getRepairRequestById);
router.put('/:id', authMiddleware.verifyToken, repairRequestUpload, updateRepairRequest); // รองรับอัปเดต
router.delete('/:id', authMiddleware.verifyToken, deleteRepairRequest); // รองรับลบ

export default router;
