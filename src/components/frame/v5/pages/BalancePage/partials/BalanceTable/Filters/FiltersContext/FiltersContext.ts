import { createContext, useContext } from 'react';

import {
  type FiltersValues,
  type TBalanceTableFilters,
  type TBalanceTableFilterKey,
} from './types.ts';

import type React from 'react';

export interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  selectedFiltersCount: number;
  handleResetFilters: (filter: FiltersValues) => void;
  filters: TBalanceTableFilters;
  handleFiltersChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: TBalanceTableFilterKey,
  ) => void;
}

export const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined,
);

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error(
      'useFiltersContext must be used within the FiltersContextProvider',
    );
  }
  return context;
};
