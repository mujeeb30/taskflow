import { getDb } from '../config/database.js';

export const ColumnModel = {
  findByBoardId(boardId) {
    const db = getDb();
    return db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC').all(boardId);
  },

  findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM columns WHERE id = ?').get(id);
  },

  /**
   * REQUIRED NON-TRIVIAL SQL QUERY 1:
   * Aggregates task count per column for a specified board using LEFT JOIN and GROUP BY.
   */
  getTasksPerColumn(boardId = 1) {
    const db = getDb();
    const query = `
      SELECT 
        c.id AS column_id, 
        c.name AS column_name, 
        c.position, 
        COUNT(t.id) AS task_count
      FROM columns c
      LEFT JOIN tasks t ON c.id = t.column_id
      WHERE c.board_id = ?
      GROUP BY c.id, c.name, c.position
      ORDER BY c.position ASC
    `;
    return db.prepare(query).all(boardId);
  }
};
