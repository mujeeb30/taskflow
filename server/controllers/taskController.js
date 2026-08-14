import { TaskModel } from '../models/taskModel.js';
import { ColumnModel } from '../models/columnModel.js';

export const TaskController = {
  getTasks(req, res, next) {
    try {
      const { priority, search, board_id } = req.query;
      const boardId = board_id ? Number(board_id) : 1;
      const tasks = TaskModel.getAllFiltered({ priority, search, boardId });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  getTaskById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const task = TaskModel.findById(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  createTask(req, res, next) {
    try {
      const { column_id, title, description, priority } = req.body;

      // Verify column exists
      const column = ColumnModel.findById(Number(column_id));
      if (!column) {
        return res.status(404).json({ error: 'Target column does not exist.' });
      }

      const newTask = TaskModel.create({
        column_id: Number(column_id),
        title,
        description,
        priority
      });

      res.status(201).json(newTask);
    } catch (err) {
      next(err);
    }
  },

  updateTask(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { title, description, priority } = req.body;

      const updatedTask = TaskModel.update(id, { title, description, priority });

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      res.json(updatedTask);
    } catch (err) {
      next(err);
    }
  },

  moveTask(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { column_id, position } = req.body;

      if (!column_id || isNaN(Number(column_id))) {
        return res.status(400).json({ error: 'Valid column_id is required to move task.' });
      }

      const column = ColumnModel.findById(Number(column_id));
      if (!column) {
        return res.status(404).json({ error: 'Target column does not exist.' });
      }

      const movedTask = TaskModel.move(id, Number(column_id), position !== undefined ? Number(position) : null);

      if (!movedTask) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      res.json(movedTask);
    } catch (err) {
      next(err);
    }
  },

  deleteTask(req, res, next) {
    try {
      const id = Number(req.params.id);
      const deleted = TaskModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      res.json({ message: 'Task deleted successfully', id });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Endpoint exposing Required SQL Query 2: Tasks with a given priority, ordered newest first
   */
  getTasksByPriority(req, res, next) {
    try {
      const { priority } = req.params;

      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be Low, Medium, or High.' });
      }

      const tasks = TaskModel.getTasksByPriority(priority);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }
};
