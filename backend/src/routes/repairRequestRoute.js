import express from 'express';
import { 
    createRepairRequest, 
    getUserRepairRequests, 
    getRepairRequestById, 
    updateRepairRequest, 
    deleteRepairRequest,
    getAllRepairRequests,
    addPartsToRepairRequest,
    getUserCompletedProducts,
    getDefaultRepairPrice,
    updateDefaultRepairPrice
} from '../controllers/repairRequestController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { repairRequestUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get("/default-repair-price", getDefaultRepairPrice);
router.put("/default-repair-price", authMiddleware.verifyToken, updateDefaultRepairPrice);

router.post('/', authMiddleware.verifyToken, repairRequestUpload, createRepairRequest);
router.get('/', authMiddleware.verifyToken, getUserRepairRequests);
router.get('/all', authMiddleware.verifyToken, getAllRepairRequests);
router.get('/completed-products', authMiddleware.verifyToken, getUserCompletedProducts);
router.get('/:id', authMiddleware.verifyToken, getRepairRequestById);
router.put('/:id', authMiddleware.verifyToken, repairRequestUpload, updateRepairRequest);
router.delete('/:id', authMiddleware.verifyToken, deleteRepairRequest);
router.post('/add-parts', authMiddleware.verifyToken, addPartsToRepairRequest);

export default router;
