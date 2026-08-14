import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path can be overridden by environment variable (useful for testing)
const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : (process.env.DB_PATH || path.resolve(__dirname, '../db/taskflow.db'));

let db;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    // Enable foreign key constraints in SQLite
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
