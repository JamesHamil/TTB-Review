// Simplified Vercel serverless function for label verification

import OpenAI from 'openai';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Main handler
export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    await new Promise((resolve, reject) => {
      upload.single('image')(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided', code: 'MISSING_FIELDS' });
    }

    const { beverageCategory, brandName, productType, alcoholContent, netContents } = req.body;

    if (!brandName || !productType || !alcoholContent) {
      return res.status(400).json({ error: 'Missing required fields', code: 'MISSING_FIELDS' });
    }

    // Convert image to base64
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Parse net contents
    const netContentsArray = netContents ? JSON.parse(netContents) : [];

    // Build prompt for OpenAI
    const prompt = `Analyze this ${beverageCategory || 'alcohol'} beverage label. Extract:
1. Brand Name
2. Product Type/Class
3. Alcohol Content (ABV %)
4. Net Contents
5. Government Warning text (exact text if present)
${beverageCategory === 'wine' ? '6. Sulfite Declaration\n' : ''}

Compare with form data:
- Brand Name: "${brandName}"
- Product Type: "${productType}"
- Alcohol Content: ${alcoholContent}%
${netContentsArray.length > 0 ? `- Net Contents: ${netContentsArray.join(', ')}\n` : ''}

Return JSON:
{
  "extractedText": "full text from label",
  "brandNameMatch": true/false,
  "productTypeMatch": true/false,
  "alcoholContentMatch": true/false,
  ${netContentsArray.length > 0 ? `"netContentsMatches": [${netContentsArray.map(nc => `{"value": "${nc}", "found": true/false}`).join(',')}],` : '"netContentsMatch": true,'}
  "governmentWarningFound": true/false,
  "governmentWarningText": "warning text or empty",
  ${beverageCategory === 'wine' ? '"sulfiteDeclarationFound": true/false,' : ''}
  "brandNameFound": "found text",
  "productTypeFound": "found text",
  "alcoholContentFound": "found text",
  "netContentsFound": "found text"
}`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: base64Image } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const analysisResult = JSON.parse(jsonMatch[0]);

    // Check if image was readable
    if (!analysisResult.extractedText || analysisResult.extractedText.trim().length < 10) {
      return res.status(400).json({
        error: 'Could not read text from the label image',
        message: 'The image quality is too low or no label text was detected.',
        code: 'UNREADABLE_IMAGE',
      });
    }

    // Check if label info was found
    const nothingFound = !analysisResult.brandNameFound && !analysisResult.productTypeFound && !analysisResult.alcoholContentFound;
    if (nothingFound) {
      return res.status(400).json({
        error: 'No label information detected',
        message: 'Could not detect any label information in the image.',
        code: 'NO_LABEL_DETECTED',
      });
    }

    // Return results
    return res.status(200).json({
      success: true,
      data: analysisResult,
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}

