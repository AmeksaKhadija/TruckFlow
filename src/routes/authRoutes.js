import express from 'express';
import {
    register,
    login,
    refreshAccessToken,
    logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logout);

export default router;