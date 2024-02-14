export enum FiltersValues {
  TokenType = 'tokenType',
  Attributes = 'attributes',
}

export interface TokenTypes {
  [key: string]: boolean;
}

export interface AttributeFilters {
  native: boolean;
  reputation: boolean;
}

export interface BalanceTableFilters {
  tokenTypes?: TokenTypes;
  attributeFilters?: AttributeFilters;
}
