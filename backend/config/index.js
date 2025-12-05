// Server configuration

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  openaiApiKey: process.env.OPENAI_API_KEY,
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

export function validateConfig() {
  if (!config.openaiApiKey) {
    console.error('OPENAI_API_KEY is not configured in .env file');
    process.exit(1);
  }
}

