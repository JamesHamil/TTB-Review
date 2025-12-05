// Verification controller

import { analyzeLabel } from '../services/openai.service.js';
import { runComplianceChecks } from '../services/compliance.service.js';
import { validateRequest, validateImageAnalysis, parseNetContents } from '../services/validation.service.js';

/**
 * Health check endpoint
 */
export async function healthCheck(req, res) {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
}

/**
 * Verify label endpoint
 */
export async function verifyLabel(req, res, next) {
  try {
    // Validate request
    validateRequest(req);

    // Extract and parse request data
    const { beverageCategory, brandName, productType, alcoholContent, sulfiteDeclaration, ingredients } = req.body;
    const netContents = parseNetContents(req.body.netContents);

    // Convert image buffer to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Prepare form data for analysis
    const formData = {
      brandName,
      productType,
      alcoholContent,
      sulfiteDeclaration,
      ingredients,
    };

    // Analyze label with AI
    const analysisResult = await analyzeLabel(base64Image, beverageCategory, formData, netContents);

    // Validate image was readable and label was detected
    validateImageAnalysis(analysisResult);

    // Run compliance checks
    const complianceIssues = runComplianceChecks(beverageCategory, formData, analysisResult);
    analysisResult.complianceIssues = complianceIssues;

    // Return successful response
    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    next(error);
  }
}

