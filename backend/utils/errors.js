// Error handling utilities

export class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export const ERROR_CODES = {
  UNREADABLE_IMAGE: 'UNREADABLE_IMAGE',
  NO_LABEL_DETECTED: 'NO_LABEL_DETECTED',
  MISSING_FIELDS: 'MISSING_FIELDS',
  INVALID_API_KEY: 'INVALID_API_KEY',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
};

export function handleOpenAIError(error) {
  if (error.code === 'insufficient_quota') {
    throw new AppError(
      'OpenAI API quota exceeded. Please check your API plan.',
      402,
      ERROR_CODES.QUOTA_EXCEEDED
    );
  }

  if (error.code === 'invalid_api_key') {
    throw new AppError(
      'Invalid OpenAI API key configuration.',
      401,
      ERROR_CODES.INVALID_API_KEY
    );
  }

  throw error;
}

