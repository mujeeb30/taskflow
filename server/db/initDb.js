import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function initializeDatabase() {
  const db = getDb();
  
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const seedPath = path.resolve(__dirname, 'seed.sql');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  // Execute schema creation
  db.exec(schemaSql);

  // Execute initial seed data if board count is 0
  const boardCount = db.prepare('SELECT COUNT(*) as count FROM boards').get();
  if (boardCount.count === 0) {
    db.exec(seedSql);
    console.log('Database initialized and seeded successfully.');
  } else {
    console.log('Database already initialized.');
  }
}

// Run standalone if script called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}
