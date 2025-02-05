import AttributeFilters from './AttributeFilters/index.ts';
import ChainFilters from './ChainFilters/index.ts';
import TokenFilters from './TokenFilters/index.ts';

export const BalancePageFilter = {
  Token: TokenFilters,
  Attribute: AttributeFilters,
  Chain: ChainFilters,
};
