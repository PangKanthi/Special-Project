import { Router } from 'express';
import { uploadSlip, checkSlip } from '../controllers/slipUploadController.js';
import { slipUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.post('/upload-slip', slipUpload, uploadSlip);
router.post('/check-slip', slipUpload, checkSlip);

export default router;
