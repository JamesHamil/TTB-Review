// Custom hook for handling label verification

import { useState, useEffect } from 'react';
import { verifyLabel } from '../services/api';
import { PROGRESS_CONFIG, ERROR_CODES } from '../constants';
import type { FormData, VerificationResult, VerificationAnalysisResult } from '../types';

export function useVerification() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [progressInterval, setProgressInterval] = useState<number | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const startProgressAnimation = (): number => {
    let currentProgress = 0;
    const newInterval = setInterval(() => {
      currentProgress += 1;
      if (currentProgress <= PROGRESS_CONFIG.MAX_PROGRESS) {
        setProgress(currentProgress);
      }
    }, PROGRESS_CONFIG.INTERVAL_MS);

    setProgressInterval(newInterval);
    return newInterval;
  };

  const stopProgressAnimation = (interval: number) => {
    if (interval) {
      clearInterval(interval);
      setProgressInterval(null);
    }
  };

  const buildVerificationResult = (
    analysisResult: VerificationAnalysisResult,
    formData: FormData
  ): VerificationResult => {
    const details: string[] = [];
    const nonEmptyNetContents = formData.netContents.filter(nc => nc.trim() !== '');

    // Brand name
    if (analysisResult.brandNameMatch) {
      details.push(`✓ Brand name "${formData.brandName}" found on label`);
    } else {
      details.push(
        `✗ Brand name "${formData.brandName}" NOT found on label${
          analysisResult.brandNameFound ? ` (found: "${analysisResult.brandNameFound}")` : ''
        }`
      );
    }

    // Product type
    if (analysisResult.productTypeMatch) {
      details.push(`✓ Product type "${formData.productType}" found on label`);
    } else {
      details.push(
        `✗ Product type "${formData.productType}" NOT found on label${
          analysisResult.productTypeFound ? ` (found: "${analysisResult.productTypeFound}")` : ''
        }`
      );
    }

    // Alcohol content
    if (analysisResult.alcoholContentMatch) {
      details.push(`✓ Alcohol content ${formData.alcoholContent}% found on label`);
    } else {
      details.push(
        `✗ Alcohol content ${formData.alcoholContent}% NOT found on label${
          analysisResult.alcoholContentFound ? ` (found: ${analysisResult.alcoholContentFound})` : ''
        }`
      );
    }

    // Net contents
    if (nonEmptyNetContents.length > 0) {
      if (Array.isArray(analysisResult.netContentsMatches)) {
        analysisResult.netContentsMatches.forEach((match) => {
          if (match.found) {
            details.push(`✓ Net contents "${match.value}" found on label`);
          } else {
            details.push(`✗ Net contents "${match.value}" NOT found on label`);
          }
        });
      } else if (analysisResult.netContentsMatch) {
        details.push(`✓ Net contents found on label`);
      } else {
        details.push(
          `✗ Net contents NOT found on label${
            analysisResult.netContentsFound ? ` (found: "${analysisResult.netContentsFound}")` : ''
          }`
        );
      }
    }

    // Government warning
    if (analysisResult.governmentWarningFound) {
      details.push(`✓ Government warning statement found on label`);
    } else {
      details.push(`⚠ Government warning statement NOT found on label (required by law)`);
    }

    // Category-specific checks
    if (formData.beverageCategory === 'wine') {
      if (analysisResult.sulfiteDeclarationFound) {
        details.push(`✓ Sulfite declaration found on label`);
      } else {
        details.push(`✗ Sulfite declaration NOT found on label (required for wine)`);
      }
    }

    if (formData.beverageCategory === 'beer' && formData.ingredients) {
      if (analysisResult.ingredientsFound) {
        details.push(`✓ Ingredients found on label`);
      } else {
        details.push(`⚠ Ingredients NOT found on label`);
      }
    }

    // Calculate overall success
    const netContentsAllMatch =
      nonEmptyNetContents.length === 0
        ? true
        : Array.isArray(analysisResult.netContentsMatches)
        ? analysisResult.netContentsMatches.every((m) => m.found)
        : analysisResult.netContentsMatch;

    const categoryRequirementsMet =
      formData.beverageCategory === 'wine' ? analysisResult.sulfiteDeclarationFound === true : true;

    const allRequiredMatch =
      analysisResult.brandNameMatch &&
      analysisResult.productTypeMatch &&
      analysisResult.alcoholContentMatch &&
      netContentsAllMatch &&
      categoryRequirementsMet;

    const hasComplianceIssues =
      analysisResult.complianceIssues && analysisResult.complianceIssues.length > 0;

    return {
      success: allRequiredMatch && (analysisResult.governmentWarningFound ?? false) && !hasComplianceIssues,
      brandNameMatch: analysisResult.brandNameMatch,
      productTypeMatch: analysisResult.productTypeMatch,
      alcoholContentMatch: analysisResult.alcoholContentMatch,
      netContentsMatch: netContentsAllMatch,
      governmentWarningFound: analysisResult.governmentWarningFound ?? false,
      sulfiteDeclarationFound: analysisResult.sulfiteDeclarationFound ?? false,
      ingredientsFound: analysisResult.ingredientsFound ?? false,
      complianceIssues: analysisResult.complianceIssues || [],
      details,
      extractedText: analysisResult.extractedText || '',
    };
  };

  const verify = async (imageFile: File, formData: FormData): Promise<void> => {
    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    const interval = startProgressAnimation();

    try {
      const response = await verifyLabel(imageFile, formData);

      stopProgressAnimation(interval);
      setProgress(PROGRESS_CONFIG.RESPONSE_PROGRESS);

      const result = buildVerificationResult(response.data, formData);
      setResult(result);

      setProgress(PROGRESS_CONFIG.COMPLETE_PROGRESS);

      setTimeout(() => {
        setProgress(0);
      }, PROGRESS_CONFIG.DELAY_BEFORE_RESET);
    } catch (error) {
      stopProgressAnimation(interval);
      
      if (error instanceof Error) {
        const err = error as Error & { code?: string; userMessage?: string };
        
        if (err.code === ERROR_CODES.UNREADABLE_IMAGE || err.code === ERROR_CODES.NO_LABEL_DETECTED) {
          alert(`⚠️ ${err.message}\n\n${err.userMessage}`);
          setIsProcessing(false);
          return;
        }
      }

      alert('Could not read text from the label image. Please try a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetVerification = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
    setResult(null);
    setProgress(0);
    setIsProcessing(false);
  };

  return {
    isProcessing,
    progress,
    result,
    verify,
    resetVerification,
  };
}

