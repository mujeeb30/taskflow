import { ColumnModel } from '../models/columnModel.js';

export const ColumnController = {
  getColumns(req, res, next) {
    try {
      const boardId = req.query.board_id ? Number(req.query.board_id) : 1;
      const columns = ColumnModel.findByBoardId(boardId);
      res.json(columns);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Endpoint exposing Required SQL Query 1: Count of tasks per column on a board
   */
  getTasksPerColumn(req, res, next) {
    try {
      const boardId = req.query.board_id ? Number(req.query.board_id) : 1;
      const stats = ColumnModel.getTasksPerColumn(boardId);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }
};
