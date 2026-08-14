import app from './app.js';
import { initializeDatabase } from './db/initDb.js';

const PORT = process.env.PORT || 5001;

// Ensure database tables and seed data exist
initializeDatabase();

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Backend Server running on http://localhost:${PORT}`);
});
