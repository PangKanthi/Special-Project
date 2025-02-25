import express from 'express';
import {
    getAllInstallationKits,
    getInstallationKitById,
    updateInstallationKit,
    deleteInstallationKit
} from '../controllers/installationKitController.js';

const router = express.Router();

router.get('/', getAllInstallationKits);
router.get('/:id', getInstallationKitById);
router.put('/:id', updateInstallationKit);
router.delete('/:id', deleteInstallationKit);

export default router;
