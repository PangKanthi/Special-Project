import express from 'express';
import { 
    createRepairRequest, 
    getUserRepairRequests, 
    getRepairRequestById, 
    updateRepairRequest, 
    deleteRepairRequest,
    getAllRepairRequests
} from '../controllers/repairRequestController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { repairRequestUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware.verifyToken, repairRequestUpload, createRepairRequest);
router.get('/', authMiddleware.verifyToken, getUserRepairRequests);
router.get('/all', authMiddleware.verifyToken, getAllRepairRequests);
router.get('/:id', authMiddleware.verifyToken, getRepairRequestById);
router.put('/:id', authMiddleware.verifyToken, repairRequestUpload, updateRepairRequest);
router.delete('/:id', authMiddleware.verifyToken, deleteRepairRequest);

export default router;
