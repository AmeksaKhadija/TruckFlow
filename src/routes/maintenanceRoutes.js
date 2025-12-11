import express from 'express';
import { getMaintenanceAlerts } from '../controllers/maintenanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route accessible uniquement aux admins
router.get('/alertes', protect, authorize('admin'), getMaintenanceAlerts);

export default router;