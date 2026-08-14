import express from 'express';
import { TaskController } from '../controllers/taskController.js';
import { validateTaskCreation, validateTaskUpdate } from '../middlewares/validation.js';

const router = express.Router();

// GET /api/tasks -> filter tasks by priority/search
router.get('/', TaskController.getTasks);

// GET /api/tasks/priority/:priority -> REQUIRED SQL QUERY 2
router.get('/priority/:priority', TaskController.getTasksByPriority);

// GET /api/tasks/:id -> single task details
router.get('/:id', TaskController.getTaskById);

// POST /api/tasks -> create new task (validated)
router.post('/', validateTaskCreation, TaskController.createTask);

// PUT /api/tasks/:id -> update task (validated)
router.put('/:id', validateTaskUpdate, TaskController.updateTask);

// PATCH /api/tasks/:id/move -> move task between columns / positions
router.patch('/:id/move', TaskController.moveTask);

// DELETE /api/tasks/:id -> delete task
router.delete('/:id', TaskController.deleteTask);

export default router;
