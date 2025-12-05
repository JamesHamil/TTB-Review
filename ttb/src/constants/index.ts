// Constants for the TTB Label Verification System

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const BEVERAGE_CATEGORIES = {
  SPIRITS: 'spirits' as const,
  WINE: 'wine' as const,
  BEER: 'beer' as const,
};

export const PLACEHOLDERS = {
  spirits: 'e.g., Kentucky Straight Bourbon Whiskey',
  wine: 'e.g., Cabernet Sauvignon, Table Wine',
  beer: 'e.g., IPA, Lager, Stout',
};

export const PRODUCT_TYPE_DESCRIPTIONS = {
  spirits: 'Class/type designation (e.g., Whiskey, Vodka, Rum)',
  wine: 'Varietal or designation (e.g., Chardonnay, Red Wine)',
  beer: 'Beer style or type (e.g., Pale Ale, Pilsner)',
};

export const ERROR_CODES = {
  UNREADABLE_IMAGE: 'UNREADABLE_IMAGE',
  NO_LABEL_DETECTED: 'NO_LABEL_DETECTED',
} as const;

export const PROGRESS_CONFIG = {
  INTERVAL_MS: 110,
  MAX_PROGRESS: 90,
  COMPLETE_PROGRESS: 100,
  RESPONSE_PROGRESS: 95,
  DELAY_BEFORE_RESET: 500,
} as const;

