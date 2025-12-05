// Main server file

import express from 'express';
import cors from 'cors';
import { config, validateConfig } from './config/index.js';
import verificationRoutes from './routes/verification.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// Validate configuration
validateConfig();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', verificationRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`✅ Backend server running on http://localhost:${config.port}`);
  console.log(`📡 API endpoint: http://localhost:${config.port}/api/verify-label`);
});
