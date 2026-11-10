import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.js';
import communityRouter from './routes/community.js';
import reviewsRouter from './routes/reviews.js';
import ordersRouter from './routes/orders.js';
import newsletterRouter from './routes/newsletter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', productsRouter);
app.use('/api', communityRouter);
app.use('/api', reviewsRouter);
app.use('/api', ordersRouter);
app.use('/api', newsletterRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: 'SO BEAU',
    tagline: 'SO YOU. SO BEAU.',
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback for client-side routing in Express 5
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // In development, Vite handles frontend
      res.status(404).send('API running. Frontend dev server runs on http://localhost:3000');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[SO BEAU API] Server running on http://localhost:${PORT}`);
});
