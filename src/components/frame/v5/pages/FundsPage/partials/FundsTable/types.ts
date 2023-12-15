import { FiltersProps } from '~v5/shared/Filters/types';

export interface FundsTableModel {
  token?: {
    tokenAddress: string;
    symbol: string;
    name: string;
    decimals: number;
  };
}

export type FundsTableFilters = {
  status: {
    approved: boolean;
    unapproved: boolean;
  };
  type: {
    [key: string]: boolean;
  };
};

export interface UseFundsTableProps {
  filters: FiltersProps<FundsTableFilters>;
  searchedTokens: {
    isApproved: boolean;
    token?: {
      tokenAddress: string;
      symbol: string;
      name: string;
      decimals: number;
    };
  }[];
}
