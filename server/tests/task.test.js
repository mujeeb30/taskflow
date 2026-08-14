import request from 'supertest';
import app from '../app.js';
import { initializeDatabase } from '../db/initDb.js';
import { closeDb, getDb } from '../config/database.js';

describe('Task API Endpoints', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    initializeDatabase();
  });

  afterAll(() => {
    closeDb();
  });

  // TEST 1: Creating a task with no title fails (400 validation error)
  it('should reject creating a task with an empty title', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({
        column_id: 1,
        title: '   ', // whitespace only
        description: 'Test description',
        priority: 'High'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/title is required/i);
  });

  // TEST 2: Moving a task updates its status/column correctly
  it('should move a task to a new column correctly', async () => {
    // 1. Create a task in column 1 (To Do)
    const createRes = await request(app)
      .post('/api/tasks')
      .send({
        column_id: 1,
        title: 'Task To Move',
        description: 'Moving test task',
        priority: 'Medium'
      });

    expect(createRes.status).toBe(201);
    const taskId = createRes.body.id;
    expect(createRes.body.column_id).toBe(1);

    // 2. Move task to column 2 (In Progress)
    const moveRes = await request(app)
      .patch(`/api/tasks/${taskId}/move`)
      .send({
        column_id: 2
      });

    expect(moveRes.status).toBe(200);
    expect(moveRes.body.column_id).toBe(2);

    // 3. Verify move persisted via GET
    const getRes = await request(app).get(`/api/tasks/${taskId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.column_id).toBe(2);
    expect(getRes.body.column_name).toBe('In Progress');
  });
});
