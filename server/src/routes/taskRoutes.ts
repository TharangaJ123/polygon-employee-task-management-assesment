import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Protect all task routes
router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', requireAdmin, createTask);
router.put('/:id', updateTask);
router.delete('/:id', requireAdmin, deleteTask);

export default router;
