import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { uploadProductImages, uploadKitImages } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/products', upload.array('images', 5), uploadProductImages);

router.post('/kits', upload.array('images', 5), uploadKitImages);

export default router;
