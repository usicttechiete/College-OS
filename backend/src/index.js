const express = require('express');
const cors = require('cors');
const env = require('./config/env');

// Import routes
const authRoutes = require('./routes/auth');
const foundRoutes = require('./routes/found');

const app = express();

// Middleware
app.use(cors({
  origin: env.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/found', foundRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'SERVER_ERROR',
  });
});

// Start server
app.listen(env.port, () => {
  console.log(`🚀 Server running on http://localhost:${env.port}`);
  console.log(`📦 Environment: ${env.nodeEnv}`);
});

module.exports = app;
