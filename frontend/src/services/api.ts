// API service for TTB Label Verification

import { API_URL, ERROR_CODES } from '../constants';
import type { FormData, VerificationResponse, ErrorResponse } from '../types';

/**
 * Verify a label image against form data
 */
export async function verifyLabel(
  imageFile: File,
  formData: FormData
): Promise<VerificationResponse> {
  const formDataToSend = new FormData();
  formDataToSend.append('image', imageFile);
  formDataToSend.append('beverageCategory', formData.beverageCategory);
  formDataToSend.append('brandName', formData.brandName);
  formDataToSend.append('productType', formData.productType);
  formDataToSend.append('alcoholContent', formData.alcoholContent);

  // Add category-specific fields
  if (formData.beverageCategory === 'wine' && formData.sulfiteDeclaration) {
    formDataToSend.append('sulfiteDeclaration', formData.sulfiteDeclaration);
  }
  if (formData.beverageCategory === 'beer' && formData.ingredients) {
    formDataToSend.append('ingredients', formData.ingredients);
  }

  // Filter out empty net contents and send as JSON array
  const nonEmptyNetContents = formData.netContents.filter(nc => nc.trim() !== '');
  if (nonEmptyNetContents.length > 0) {
    formDataToSend.append('netContents', JSON.stringify(nonEmptyNetContents));
  }

  const response = await fetch(`${API_URL}/api/verify-label`, {
    method: 'POST',
    body: formDataToSend,
  });

  if (!response.ok) {
    return handleApiError(response);
  }

  return response.json();
}

/**
 * Handle API errors with specific error codes
 */
async function handleApiError(response: Response): Promise<never> {
  let errorData: ErrorResponse;
  
  try {
    errorData = await response.json();
  } catch {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  // Handle specific error cases
  if (errorData.code === ERROR_CODES.UNREADABLE_IMAGE || 
      errorData.code === ERROR_CODES.NO_LABEL_DETECTED) {
    const error = new Error(errorData.error) as Error & { code?: string; message: string; userMessage?: string };
    error.code = errorData.code;
    error.userMessage = errorData.message;
    throw error;
  }

  throw new Error(errorData.error || 'Failed to verify label');
}

