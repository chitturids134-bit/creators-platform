const ApiError = require('../utils/ApiError');

// Centralized error handling middleware
function errorHandler(err, req, res, next) {
  // If error is an instance of ApiError use provided statusCode, else 500
  const statusCode = err.statusCode || 500;

  // Log server errors (500) with stack for debugging
  if (statusCode === 500) {
    console.error('Unhandled Error:', err);
  }

  // Ensure consistent response format
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error'
  });
}

module.exports = errorHandler;
