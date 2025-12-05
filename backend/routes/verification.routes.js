// Verification routes

import express from 'express';
import { healthCheck, verifyLabel } from '../controllers/verification.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Health check route
router.get('/health', healthCheck);

// Label verification route
router.post('/api/verify-label', upload.single('image'), verifyLabel);

export default router;

