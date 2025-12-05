// Vercel serverless function wrapper for Express backend

import express from 'express';
import cors from 'cors';
import { healthCheck, verifyLabel } from '../backend/controllers/verification.controller.js';
import { upload } from '../backend/middleware/upload.middleware.js';
import { errorHandler, notFoundHandler } from '../backend/middleware/error.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', healthCheck);
app.post('/api/verify-label', upload.single('image'), verifyLabel);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
