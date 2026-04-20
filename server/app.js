const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const uploadRoutes = require('./routes/upload');
const ApiError = require('./utils/ApiError');
const errorHandler = require('./middleware/errorHandler');
const timingMiddleware = require('./middleware/timing');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Request timing
app.use(timingMiddleware);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Server is running!',
    timestamp: new Date(),
    database: 'Connected'
  });
});

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Not Found'));
});

// Error handler
app.use(errorHandler);

module.exports = app;