import { Router } from 'express';
import { getEmployees, updateProfile } from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Admin route to get employees for task assignment
router.get('/employees', requireAdmin, getEmployees);

// Common route to update own profile
router.put('/profile', updateProfile);

export default router;
