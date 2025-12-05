// Type definitions for the TTB Label Verification System

export type BeverageCategory = 'spirits' | 'wine' | 'beer';

export interface FormData {
  beverageCategory: BeverageCategory;
  brandName: string;
  productType: string;
  alcoholContent: string;
  netContents: string[];
  sulfiteDeclaration?: string;
  ingredients?: string;
}

export interface ComplianceIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
}

export interface VerificationResult {
  success: boolean;
  brandNameMatch: boolean;
  productTypeMatch: boolean;
  alcoholContentMatch: boolean;
  netContentsMatch: boolean;
  governmentWarningFound: boolean;
  sulfiteDeclarationFound?: boolean;
  ingredientsFound?: boolean;
  complianceIssues?: ComplianceIssue[];
  details: string[];
  extractedText: string;
}

export interface VerificationResponse {
  success: boolean;
  data: VerificationAnalysisResult;
}

export interface VerificationAnalysisResult {
  extractedText: string;
  brandNameMatch: boolean;
  productTypeMatch: boolean;
  alcoholContentMatch: boolean;
  netContentsMatches?: Array<{ value: string; found: boolean }>;
  netContentsMatch?: boolean;
  governmentWarningFound: boolean;
  governmentWarningText?: string;
  sulfiteDeclarationFound?: boolean;
  sulfiteDeclarationText?: string;
  ingredientsFound?: boolean;
  ingredientsText?: string;
  brandNameFound: string;
  productTypeFound: string;
  alcoholContentFound: string;
  netContentsFound: string;
  complianceIssues?: ComplianceIssue[];
}

export interface ErrorResponse {
  error: string;
  message?: string;
  code?: string;
}

