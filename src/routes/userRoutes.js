import express from 'express';
import { getAllChauffeurs, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/chauffeurs', getAllChauffeurs);
router.delete('/:id', deleteUser);

export default router;