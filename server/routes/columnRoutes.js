import express from 'express';
import { ColumnController } from '../controllers/columnController.js';

const router = express.Router();

// GET /api/columns -> list columns
router.get('/', ColumnController.getColumns);

// GET /api/columns/tasks-per-column -> REQUIRED SQL QUERY 1
router.get('/tasks-per-column', ColumnController.getTasksPerColumn);

export default router;
