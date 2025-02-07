export enum FiltersValues {
  TokenType = 'tokenType',
  Attributes = 'attributes',
  Chain = 'chain',
}

export interface TokenTypes {
  [key: string]: boolean;
}

type TFilterConfig = {
  isChecked: boolean;
  id?: string;
};

type TAttributeFilter = {
  native: TFilterConfig;
  reputation: TFilterConfig;
};

export type TBalanceTableFilters = {
  attribute: TAttributeFilter;
  chain: Record<string, TFilterConfig>;
  token: Record<string, TFilterConfig>;
};

export type TBalanceTableFilterKey = keyof TBalanceTableFilters;
