import express from 'express';
import {
    getAllPneus,
    getPneuById,
    getPneusByVehicule,
    createPneu,
    updatePneu,
    updateUsure,
    deletePneu,
    getUsureStats,
} from '../controllers/pneuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes Admin
router.get('/', protect, authorize('admin'), getAllPneus);
router.get('/stats/usure', protect, authorize('admin'), getUsureStats);
router.get('/:id', protect, authorize('admin'), getPneuById);
router.get('/vehicule/:typeVehicule/:vehiculeId', protect, getPneusByVehicule);
router.post('/', protect, authorize('admin'), createPneu);
router.put('/:id', protect, authorize('admin'), updatePneu);
router.delete('/:id', protect, authorize('admin'), deletePneu);

// Route Chauffeur ou Admin
router.patch('/:id/usure', protect, updateUsure);

export default router;