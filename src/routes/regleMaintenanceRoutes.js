import express from 'express';
import {
    getAllRegles,
    getRegleById,
    createRegle,
    updateRegle,
    deleteRegle,
} from '../controllers/regleMaintenanceController.js';
import { protect, authorize, validate } from '../middleware/authMiddleware.js';
import { createRegleMaintenanceSchema, updateRegleMaintenanceSchema } from '../middleware/Validators.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllRegles);
router.get('/:id', getRegleById);
router.post('/', validate(createRegleMaintenanceSchema), createRegle);
router.put('/:id', validate(updateRegleMaintenanceSchema), updateRegle);
router.delete('/:id', deleteRegle);

export default router;