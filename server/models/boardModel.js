import { getDb } from '../config/database.js';

export const BoardModel = {
  findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM boards WHERE id = ?').get(id);
  },

  getFullBoard(boardId = 1) {
    const db = getDb();
    const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId);
    if (!board) return null;

    const columns = db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC').all(boardId);
    const tasks = db.prepare(`
      SELECT t.*, c.name as column_name 
      FROM tasks t 
      JOIN columns c ON t.column_id = c.id 
      WHERE c.board_id = ? 
      ORDER BY t.position ASC, t.created_at DESC
    `).all(boardId);

    // Attach tasks to respective columns
    const columnsWithTasks = columns.map(col => ({
      ...col,
      tasks: tasks.filter(t => t.column_id === col.id)
    }));

    return {
      ...board,
      columns: columnsWithTasks
    };
  }
};
