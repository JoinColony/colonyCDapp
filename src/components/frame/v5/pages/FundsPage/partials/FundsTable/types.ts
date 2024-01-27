import { FilterProps } from '../Filter/types.ts';

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
  filters: FilterProps<FundsTableFilters>;
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
