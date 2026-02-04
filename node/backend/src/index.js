// FanHub Backend Entry Point
// NOTE: This file has grown organically and could use refactoring

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // TODO: Configure properly for production
app.use(express.json());

// Request logging - basic implementation
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes - imported with different styles (contractor inconsistency)
const showsRouter = require('./routes/shows');
const charactersRouter = require('./routes/characters');
const episodesRoutes = require('./routes/episodes'); // Different naming!
const quotesRouter = require('./routes/quotes');
const authRoutes = require('./routes/auth'); // Yet another style

// Mount routes - also inconsistent paths
app.use('/api/shows', showsRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/episodes', episodesRoutes);
app.use('/api/quotes', quotesRouter);
app.use('/auth', authRoutes); // No /api prefix - inconsistent!

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic root route
app.get('/', (req, res) => {
  res.json({
    name: 'FanHub API',
    version: '0.1.0',
    endpoints: [
      '/api/shows',
      '/api/characters',
      '/api/episodes',
      '/api/quotes',
      '/auth',
    ],
  });
});

// Error handling - bare minimum
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  // Sometimes we send stack, sometimes we don't - security issue!
  res.status(err.status || 500).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`FanHub API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // For testing (when we add tests)
