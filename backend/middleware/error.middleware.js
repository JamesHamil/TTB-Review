// Error handling middleware

import { AppError } from '../utils/errors.js';

/**
 * Global error handler
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      message: err.userMessage,
      code: err.code,
    });
  }

  // Handle unknown errors
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred',
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}

