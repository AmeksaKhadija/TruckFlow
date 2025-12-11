import express from 'express';
import {
    getAllTrajets,
    getTrajetById,
    getTrajetsByChauffeur,
    getTrajetsByStatut,
    createTrajet,
    updateTrajet,
    updateStatut,
    deleteTrajet,
    getStatsGlobal,
} from '../controllers/trajetController.js';
import { protect, authorize, validate } from '../middleware/authMiddleware.js';
import { createTrajetSchema, updateTrajetSchema, updateStatutSchema } from '../middleware/Validators.js';

const router = express.Router();

// Routes Admin
router.get('/', protect, authorize('admin'), getAllTrajets);
router.get('/stats/global', protect, authorize('admin'), getStatsGlobal);
router.get('/statut/:statut', protect, authorize('admin'), getTrajetsByStatut);
router.get('/:id', protect, authorize('admin'), getTrajetById);
router.post('/', protect, authorize('admin'), validate(createTrajetSchema), createTrajet);
router.put('/:id', protect, authorize('admin'), validate(updateTrajetSchema), updateTrajet);
router.delete('/:id', protect, authorize('admin'), deleteTrajet);

// Routes Chauffeur
router.get('/chauffeur/:chauffeurId', protect, getTrajetsByChauffeur);
router.patch('/:id/statut', protect, validate(updateStatutSchema), updateStatut);

export default router;