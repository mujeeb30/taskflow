import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import boardRoutes from './routes/boardRoutes.js';
import columnRoutes from './routes/columnRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve Client Build (Production & Standalone run)
const clientDist = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
