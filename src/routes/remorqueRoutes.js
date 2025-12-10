import express from 'express';
import {
    getAllRemorques,
    getRemorqueById,
    createRemorque,
    updateRemorque,
    deleteRemorque,
    getRemorquesActives,
    updateKilometrageRemorque,
} from '../controllers/remorqueController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin
router.get('/', protect, authorize('admin'), getAllRemorques);
router.get('/actives', protect, authorize('admin'), getRemorquesActives);
router.get('/:id', protect, authorize('admin'), getRemorqueById);
router.post('/', protect, authorize('admin'), createRemorque);
router.put('/:id', protect, authorize('admin'), updateRemorque);
router.delete('/:id', protect, authorize('admin'), deleteRemorque);

// Chauffeur ou Admin
router.patch('/:id/kilometrage', protect, updateKilometrageRemorque);

export default router;