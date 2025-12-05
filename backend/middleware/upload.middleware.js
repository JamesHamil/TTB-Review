// File upload middleware configuration

import multer from 'multer';
import { config } from '../config/index.js';

// Configure multer for handling file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxFileSize,
  },
});

