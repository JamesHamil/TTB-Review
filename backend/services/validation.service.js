// Validation service

import { AppError, ERROR_CODES } from '../utils/errors.js';

/**
 * Validate image quality and label detectability
 */
export function validateImageAnalysis(analysisResult) {
  const extractedText = analysisResult.extractedText || '';

  // Check if image was readable
  if (extractedText.trim().length < 10) {
    throw new AppError(
      'Could not read text from the label image',
      400,
      ERROR_CODES.UNREADABLE_IMAGE
    ).withMessage(
      'The image quality is too low or no label text was detected. Please try uploading a clearer, higher-quality image of the label.'
    );
  }

  // Check if any label information was found
  const nothingFound =
    !analysisResult.brandNameFound &&
    !analysisResult.productTypeFound &&
    !analysisResult.alcoholContentFound;

  if (nothingFound) {
    throw new AppError(
      'No label information detected',
      400,
      ERROR_CODES.NO_LABEL_DETECTED
    ).withMessage(
      'Could not detect any label information (brand name, product type, or alcohol content) in the image. Please ensure the image contains a clear alcohol beverage label.'
    );
  }
}

/**
 * Validate required request fields
 */
export function validateRequest(req) {
  if (!req.file) {
    throw new AppError('No image file provided', 400, ERROR_CODES.MISSING_FIELDS);
  }

  const { brandName, productType, alcoholContent, netContents, beverageCategory } = req.body;

  if (!brandName || !productType || !alcoholContent) {
    throw new AppError(
      'Missing required fields: brandName, productType, and alcoholContent are required',
      400,
      ERROR_CODES.MISSING_FIELDS
    );
  }

  if (!netContents) {
    throw new AppError('Missing required field: netContents is required', 400, ERROR_CODES.MISSING_FIELDS);
  }

  // Validate wine-specific requirements
  if (beverageCategory === 'wine' && !req.body.sulfiteDeclaration) {
    throw new AppError('Wine labels require a sulfite declaration', 400, ERROR_CODES.MISSING_FIELDS);
  }
}

/**
 * Parse and validate net contents
 */
export function parseNetContents(netContentsStr) {
  if (!netContentsStr) {
    return [];
  }

  try {
    const netContents = JSON.parse(netContentsStr);
    if (!Array.isArray(netContents) || netContents.length === 0) {
      throw new AppError('netContents must be a non-empty array', 400, ERROR_CODES.MISSING_FIELDS);
    }
    return netContents;
  } catch (e) {
    // If it's not JSON, treat it as a single item for backwards compatibility
    return [netContentsStr];
  }
}

// Add custom method to AppError
AppError.prototype.withMessage = function (message) {
  this.userMessage = message;
  return this;
};

