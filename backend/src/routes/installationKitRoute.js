import express from 'express';
import { getAllInstallationKits, getInstallationKitById } from '../controllers/installationKitController.js';

const router = express.Router();

router.get('/', getAllInstallationKits);
router.get('/:id', getInstallationKitById);

export default router;
