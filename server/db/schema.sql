-- TaskFlow Relational Database Schema
-- Compatible with SQLite3 / SQLite

PRAGMA foreign_keys = ON;

-- 1. Boards Table
CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Columns Table
CREATE TABLE IF NOT EXISTS columns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  column_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL DEFAULT 'Medium',
  position INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

-- Indexes for efficient filtering and sorting
CREATE INDEX IF NOT EXISTS idx_columns_board ON columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column ON tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);
