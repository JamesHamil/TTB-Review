// Vercel serverless function wrapper for Express backend

import express from 'express';
import cors from 'cors';
import { healthCheck, verifyLabel } from '../backend/controllers/verification.controller.js';
import { upload } from '../backend/middleware/upload.middleware.js';
import { errorHandler, notFoundHandler } from '../backend/middleware/error.middleware.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - Vercel routes /api/* to this function
// The path received by Express includes /api, so we match the full path
app.get('/api/health', healthCheck);
app.post('/api/verify-label', upload.single('image'), verifyLabel);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Export as Vercel serverless function
export default app;

