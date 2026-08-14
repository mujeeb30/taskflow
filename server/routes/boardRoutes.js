import express from 'express';
import { BoardController } from '../controllers/boardController.js';

const router = express.Router();

// GET /api/boards/:id? -> get board hierarchy (columns & tasks)
router.get('/:id?', BoardController.getBoard);

export default router;
