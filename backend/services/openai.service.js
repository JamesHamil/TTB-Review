// OpenAI service for image analysis

import OpenAI from 'openai';
import { config } from '../config/index.js';
import { handleOpenAIError } from '../utils/errors.js';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

/**
 * Build prompt for GPT-4 Vision based on beverage category and form data
 */
function buildPrompt(beverageCategory, formData, netContents) {
  const { brandName, productType, alcoholContent, sulfiteDeclaration, ingredients } = formData;

  return `You are analyzing an ${beverageCategory || 'alcohol'} beverage label for TTB (Alcohol and Tobacco Tax and Trade Bureau) compliance verification.

Please analyze this ${beverageCategory || 'alcohol'} label image and extract the following information:
1. Brand Name
2. Product Type/Class
3. Alcohol Content (ABV percentage)
4. Net Contents (volume, proof, or other content specifications)
5. Government Warning (extract the EXACT text of the government warning if present)${beverageCategory === 'wine' ? '\n6. Sulfite Declaration (check for "Contains Sulfites" or similar text)' : ''}${beverageCategory === 'beer' && ingredients ? '\n6. Ingredients list if visible' : ''}

Then verify if the label matches these form inputs:
- Brand Name: "${brandName}"
- Product Type: "${productType}"
- Alcohol Content: ${alcoholContent}%
${netContents.length > 0 ? `- Net Contents to verify: ${netContents.map((nc, i) => `\n  ${i + 1}. "${nc}"`).join('')}` : ''}${beverageCategory === 'wine' && sulfiteDeclaration ? `\n- Sulfite Declaration: "${sulfiteDeclaration}"` : ''}${beverageCategory === 'beer' && ingredients ? `\n- Ingredients: "${ingredients}"` : ''}

${netContents.length > 0 ? `For net contents, check EACH item separately. Each could be a volume (750 mL), proof (97 proof), or other specification.` : ''}

Respond ONLY with a JSON object in this exact format:
{
  "extractedText": "full text extracted from the label",
  "brandNameMatch": true/false,
  "productTypeMatch": true/false,
  "alcoholContentMatch": true/false,
  ${netContents.length > 0 ? `"netContentsMatches": [
    ${netContents.map(nc => `{"value": "${nc}", "found": true/false}`).join(',\n    ')}
  ],` : '"netContentsMatch": true,'}
  "governmentWarningFound": true/false,
  "governmentWarningText": "exact warning text found on label or empty string",${beverageCategory === 'wine' ? '\n  "sulfiteDeclarationFound": true/false,\n  "sulfiteDeclarationText": "what sulfite text was found or empty string",' : ''}${beverageCategory === 'beer' && ingredients ? '\n  "ingredientsFound": true/false,\n  "ingredientsText": "ingredients found on label or empty string",' : ''}
  "brandNameFound": "what you found on label or empty string",
  "productTypeFound": "what you found on label or empty string",
  "alcoholContentFound": "what you found on label or empty string",
  "netContentsFound": "what you found on label or empty string"
}`;
}

/**
 * Analyze label image using GPT-4 Vision
 */
export async function analyzeLabel(base64Image, beverageCategory, formData, netContents) {
  try {
    const prompt = buildPrompt(beverageCategory, formData, netContents);

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

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    handleOpenAIError(error);
    throw error;
  }
}

