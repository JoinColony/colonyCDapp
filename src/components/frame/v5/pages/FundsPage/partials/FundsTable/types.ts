import { type FilterProps } from '../Filter/types.ts';

export interface FundsTableModel {
  token?: {
    tokenAddress: string;
    symbol: string;
    name: string;
    decimals: number;
    chainMetadata: {
      chainId: string;
    };
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
  activeFilters: (
    | {
        filterName: string;
        filters: React.ReactNode[];
      }
    | null
    | undefined
  )[];
  searchedTokens: {
    isApproved: boolean;
    token?: {
      tokenAddress: string;
      symbol: string;
      name: string;
      decimals: number;
      chainMetadata: {
        chainId: string;
      };
    };
  }[];
}
