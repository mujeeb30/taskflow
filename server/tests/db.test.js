import { initializeDatabase } from '../db/initDb.js';
import { closeDb } from '../config/database.js';
import { ColumnModel } from '../models/columnModel.js';
import { TaskModel } from '../models/taskModel.js';

describe('Direct Database Queries Layer', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    initializeDatabase();
  });

  afterAll(() => {
    closeDb();
  });

  // TEST 3A: Direct DB test for Required Query 1 (tasks per column aggregation)
  it('should query task counts per column directly from SQL model layer', () => {
    const stats = ColumnModel.getTasksPerColumn(1);

    expect(Array.isArray(stats)).toBe(true);
    expect(stats.length).toBe(3); // To Do, In Progress, Done

    const toDoCol = stats.find(s => s.column_name === 'To Do');
    const inProgressCol = stats.find(s => s.column_name === 'In Progress');
    const doneCol = stats.find(s => s.column_name === 'Done');

    expect(toDoCol).toBeDefined();
    expect(inProgressCol).toBeDefined();
    expect(doneCol).toBeDefined();
    expect(typeof toDoCol.task_count).toBe('number');
  });

  // TEST 3B: Direct DB test for Required Query 2 (tasks by priority, newest first)
  it('should return tasks filtered by priority ordered newest first directly from SQL query', () => {
    const highTasks = TaskModel.getTasksByPriority('High');

    expect(Array.isArray(highTasks)).toBe(true);
    expect(highTasks.length).toBeGreaterThan(0);

    // All returned tasks must have High priority
    highTasks.forEach(task => {
      expect(task.priority).toBe('High');
      expect(task).toHaveProperty('column_name');
    });

    // Check chronological order (created_at DESC)
    for (let i = 0; i < highTasks.length - 1; i++) {
      const current = new Date(highTasks[i].created_at).getTime();
      const next = new Date(highTasks[i + 1].created_at).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});
