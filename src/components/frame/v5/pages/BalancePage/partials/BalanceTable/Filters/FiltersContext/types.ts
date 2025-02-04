export enum FiltersValues {
  TokenType = 'tokenType',
  Attributes = 'attributes',
  Chain = 'chain',
}

export interface TokenTypes {
  [key: string]: boolean;
}

export interface AttributeFilters {
  native: boolean;
  reputation: boolean;
}

export type BalanceFilterType = 'attribute' | 'chain' | 'token';

export type BalanceTableFilters = {
  search: string;
  attribute: AttributeFilters;
  chain: Record<string, boolean>;
  token: Record<string, boolean>;
};
