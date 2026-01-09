import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import surahRoutes from './routes/surahRoutes';
import viewRoutes from './routes/viewRoutes';
import { initializeOfflineResources } from './services/quranApi.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Initialize offline resources (fonts and translations)
(async () => {
  try {
    await initializeOfflineResources();
  } catch (error) {
    console.error('Failed to initialize offline resources:', error);
  }
})();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/surahs', surahRoutes);

// View Routes
app.use('/', viewRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).render('layout', {
    body: '<%- include("error") %>',
    title: 'Error',
    activePage: '',
    error: { title: 'Something went wrong!', message: err.message }
  });
});

app.listen(PORT, () => {
  console.log(`✅ QLean server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;