import { getDb } from '../config/database.js';

export const TaskModel = {
  findById(id) {
    const db = getDb();
    return db.prepare(`
      SELECT t.*, c.name as column_name 
      FROM tasks t 
      JOIN columns c ON t.column_id = c.id 
      WHERE t.id = ?
    `).get(id);
  },

  create({ column_id, title, description = '', priority = 'Medium' }) {
    const db = getDb();
    
    // Get highest position in column
    const maxPos = db.prepare('SELECT MAX(position) as maxPos FROM tasks WHERE column_id = ?').get(column_id);
    const position = (maxPos?.maxPos || 0) + 1;

    const stmt = db.prepare(`
      INSERT INTO tasks (column_id, title, description, priority, position)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(column_id, title.trim(), description.trim(), priority, position);
    return this.findById(info.lastInsertRowid);
  },

  update(id, { title, description, priority }) {
    const db = getDb();
    const existing = this.findById(id);
    if (!existing) return null;

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDesc = description !== undefined ? description.trim() : existing.description;
    const newPriority = priority !== undefined ? priority : existing.priority;

    db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, priority = ? 
      WHERE id = ?
    `).run(newTitle, newDesc, newPriority, id);

    return this.findById(id);
  },

  move(id, targetColumnId, newPosition = null) {
    const db = getDb();
    const task = this.findById(id);
    if (!task) return null;

    let targetPos = newPosition;
    if (targetPos === null) {
      const maxPos = db.prepare('SELECT MAX(position) as maxPos FROM tasks WHERE column_id = ?').get(targetColumnId);
      targetPos = (maxPos?.maxPos || 0) + 1;
    }

    db.prepare(`
      UPDATE tasks 
      SET column_id = ?, position = ? 
      WHERE id = ?
    `).run(targetColumnId, targetPos, id);

    return this.findById(id);
  },

  delete(id) {
    const db = getDb();
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return result.changes > 0;
  },

  /**
   * REQUIRED NON-TRIVIAL SQL QUERY 2:
   * Selects tasks filtered by priority and ordered newest first (created_at DESC).
   */
  getTasksByPriority(priority) {
    const db = getDb();
    const query = `
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.priority, 
        t.column_id, 
        c.name AS column_name, 
        t.created_at
      FROM tasks t
      JOIN columns c ON t.column_id = c.id
      WHERE t.priority = ?
      ORDER BY t.created_at DESC
    `;
    return db.prepare(query).all(priority);
  },

  getAllFiltered({ priority, search, boardId = 1 }) {
    const db = getDb();
    let query = `
      SELECT t.*, c.name as column_name 
      FROM tasks t 
      JOIN columns c ON t.column_id = c.id 
      WHERE c.board_id = ?
    `;
    const params = [boardId];

    if (priority && priority !== 'All') {
      query += ` AND t.priority = ?`;
      params.push(priority);
    }

    if (search && search.trim() !== '') {
      query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    query += ` ORDER BY t.position ASC, t.created_at DESC`;
    return db.prepare(query).all(...params);
  }
};
