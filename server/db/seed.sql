-- TaskFlow Seed Data

-- Clear existing records safely
DELETE FROM tasks;
DELETE FROM columns;
DELETE FROM boards;

-- Insert default Board
INSERT INTO boards (id, name) VALUES (1, 'Main Engineering Board');

-- Insert Columns
INSERT INTO columns (id, board_id, name, position) VALUES 
  (1, 1, 'To Do', 1),
  (2, 1, 'In Progress', 2),
  (3, 1, 'Done', 3);

-- Insert Sample Tasks
INSERT INTO tasks (title, description, priority, column_id, position, created_at) VALUES 
  ('Design Database Schema', 'Draft relational tables with foreign keys and index constraints for TaskFlow.', 'High', 3, 1, '2026-08-14 09:00:00'),
  ('Implement Backend MVC Architecture', 'Create Express routing, controllers, models, and SQLite database connection layer.', 'High', 2, 1, '2026-08-14 09:30:00'),
  ('Build React Task Board UI', 'Develop responsive column UI with drag-and-drop task movement.', 'Medium', 2, 2, '2026-08-14 10:00:00'),
  ('Add Priority Filter & Search', 'Allow filtering task board by Low, Medium, High priorities and searching by title.', 'Low', 1, 1, '2026-08-14 10:15:00'),
  ('Write Automated Backend Tests', 'Add backend unit/integration tests for validation, task movement, and raw SQL queries.', 'High', 1, 2, '2026-08-14 10:30:00');
