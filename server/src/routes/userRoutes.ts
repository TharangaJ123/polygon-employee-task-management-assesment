import { Router } from 'express';
import { getEmployees, updateProfile, createEmployee } from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Admin route to get employees for task assignment
router.get('/employees', requireAdmin, getEmployees);

// Admin route to create a new employee
router.post('/employees', requireAdmin, createEmployee);

// Common route to update own profile
router.put('/profile', updateProfile);

export default router;
