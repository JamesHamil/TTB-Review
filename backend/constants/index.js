// Backend constants

// Critical keywords for government warning (case-insensitive matching)
export const GOVERNMENT_WARNING_KEYWORDS = [
  'surgeon general',
  'pregnancy',
  'birth defects',
  'drive',
  'health problems',
];

export const WINE_RULES = {
  tableWineABVRange: {
    min: 7,
    max: 14,
  },
  requiresSulfiteDeclaration: true,
};

export const BEER_RULES = {
  typicalABVRange: {
    min: 3,
    max: 12,
  },
  ingredientsCommon: true,
};

export const SPIRITS_RULES = {
  minimumABV: 20,
  requiresProofStatement: true,
};

export const BEVERAGE_CATEGORIES = {
  SPIRITS: 'spirits',
  WINE: 'wine',
  BEER: 'beer',
};

