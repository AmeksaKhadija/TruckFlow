import express from 'express';
import {
    getAllCamions,
    getCamionById,
    createCamion,
    updateCamion,
    deleteCamion,
    getCamionsActifs,
    updateKilometrage,
} from '../controllers/camionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes protégées - Admin uniquement
router.get('/', protect, authorize('admin'), getAllCamions);
router.get('/actifs', protect, authorize('admin'), getCamionsActifs);
router.get('/:id', protect, authorize('admin'), getCamionById);
router.post('/', protect, authorize('admin'), createCamion);
router.put('/:id', protect, authorize('admin'), updateCamion);
router.delete('/:id', protect, authorize('admin'), deleteCamion);

// Routes pour chauffeurs
router.patch('/:id/kilometrage', protect, updateKilometrage);

export default router;