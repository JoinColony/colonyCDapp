import { Token } from '~types';
import { FiltersProps } from '~v5/shared/Filters/types';

export interface BalanceTableProps {
  data: BalanceTableFieldModel[];
}

export interface BalanceTableFieldModel {
  balance: string | JSX.Element;
  token?: Token;
}

export interface TokensDataProps {
  balance: string;
  token?: Token;
}

export interface TokensProps extends TokensDataProps {
  isApproved: boolean;
  isNative: boolean;
}

export type BalanceTableFilters = {
  type: {
    [key: string]: boolean;
  };
  attribute: {
    native: boolean;
    reputation: boolean;
  };
};

export interface UseFundsTableReturnType {
  filteredTokens: FiltersProps<BalanceTableFilters>;
  searchedTokens: TokensProps[] | undefined;
}
