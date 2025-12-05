// Compliance checking service

import {
  GOVERNMENT_WARNING_KEYWORDS,
  WINE_RULES,
  BEER_RULES,
  SPIRITS_RULES,
} from '../constants/index.js';

/**
 * Check government warning text compliance
 */
export function checkGovernmentWarningCompliance(warningText) {
  const issues = [];

  if (!warningText || warningText.trim().length === 0) {
    return issues;
  }

  // Normalize text for checking (case-insensitive)
  const normalizedText = warningText.toLowerCase();

  // Check for critical required content (case-insensitive)
  const criticalKeywords = [
    'surgeon general',
    'pregnancy',
    'birth defects',
    'drive',
    'health problems'
  ];

  const missingCritical = criticalKeywords.filter(
    (keyword) => !normalizedText.includes(keyword.toLowerCase())
  );

  if (missingCritical.length > 0) {
    issues.push({
      type: 'government_warning_incomplete',
      severity: 'high',
      message: `Government warning may be incomplete. Could not verify: ${missingCritical.join(', ')}`,
    });
  }

  return issues;
}

/**
 * Check wine-specific compliance rules
 */
export function checkWineCompliance(productType, alcoholContent, sulfiteDeclarationFound) {
  const issues = [];
  const abv = parseFloat(alcoholContent);
  const productTypeLower = productType.toLowerCase();

  // Check Table Wine ABV range
  if (
    productTypeLower.includes('table wine') ||
    productTypeLower.includes('table red') ||
    productTypeLower.includes('table white')
  ) {
    if (abv < WINE_RULES.tableWineABVRange.min || abv > WINE_RULES.tableWineABVRange.max) {
      issues.push({
        type: 'wine_abv_mismatch',
        severity: 'high',
        message: `Table wine must be between ${WINE_RULES.tableWineABVRange.min}% and ${WINE_RULES.tableWineABVRange.max}% ABV. Label shows ${abv}%`,
      });
    }
  }

  // Check sulfite declaration
  if (!sulfiteDeclarationFound) {
    issues.push({
      type: 'missing_sulfite_declaration',
      severity: 'high',
      message: 'Wine labels must include a sulfite declaration (e.g., "Contains Sulfites")',
    });
  }

  return issues;
}

/**
 * Check beer-specific compliance rules
 */
export function checkBeerCompliance(alcoholContent) {
  const issues = [];
  const abv = parseFloat(alcoholContent);

  if (abv < BEER_RULES.typicalABVRange.min || abv > BEER_RULES.typicalABVRange.max) {
    issues.push({
      type: 'beer_abv_unusual',
      severity: 'low',
      message: `ABV of ${abv}% is outside typical beer range (${BEER_RULES.typicalABVRange.min}-${BEER_RULES.typicalABVRange.max}%). Please verify this is correct.`,
    });
  }

  return issues;
}

/**
 * Check spirits-specific compliance rules
 */
export function checkSpiritsCompliance(alcoholContent) {
  const issues = [];
  const abv = parseFloat(alcoholContent);

  if (abv < SPIRITS_RULES.minimumABV) {
    issues.push({
      type: 'spirits_abv_too_low',
      severity: 'high',
      message: `Distilled spirits typically must be at least ${SPIRITS_RULES.minimumABV}% ABV. Label shows ${abv}%`,
    });
  }

  return issues;
}

/**
 * Run all compliance checks based on beverage category
 */
export function runComplianceChecks(beverageCategory, formData, analysisResult) {
  const { productType, alcoholContent } = formData;
  const { governmentWarningText, governmentWarningFound, sulfiteDeclarationFound } = analysisResult;

  const complianceIssues = [];

  // Government warning compliance (applies to all categories)
  // Only run detailed checks if warning text was extracted
  if (governmentWarningFound && governmentWarningText && governmentWarningText.length > 20) {
    const warningIssues = checkGovernmentWarningCompliance(governmentWarningText);
    complianceIssues.push(...warningIssues);
  }

  // Category-specific compliance
  switch (beverageCategory) {
    case 'wine':
      const wineIssues = checkWineCompliance(productType, alcoholContent, sulfiteDeclarationFound);
      complianceIssues.push(...wineIssues);
      break;

    case 'beer':
      const beerIssues = checkBeerCompliance(alcoholContent);
      complianceIssues.push(...beerIssues);
      break;

    case 'spirits':
      const spiritsIssues = checkSpiritsCompliance(alcoholContent);
      complianceIssues.push(...spiritsIssues);
      break;
  }

  return complianceIssues;
}

