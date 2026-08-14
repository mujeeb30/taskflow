import { BoardModel } from '../models/boardModel.js';

export const BoardController = {
  getBoard(req, res, next) {
    try {
      const boardId = req.params.id ? Number(req.params.id) : 1;
      const board = BoardModel.getFullBoard(boardId);

      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }

      res.json(board);
    } catch (err) {
      next(err);
    }
  }
};
