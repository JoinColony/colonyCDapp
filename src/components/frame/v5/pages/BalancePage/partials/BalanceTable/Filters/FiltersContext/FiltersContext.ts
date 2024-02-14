import { createContext, useContext } from 'react';

import {
  type AttributeFilters,
  type FiltersValues,
  type TokenTypes,
  type BalanceTableFilters,
} from './types.ts';

import type React from 'react';

interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  tokenTypes: TokenTypes;
  attributeFilters: AttributeFilters;
  activeFilters: BalanceTableFilters;
  selectedFiltersCount: number;
  handleAttributeFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleTokenTypesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleResetFilters: (filter: FiltersValues) => void;
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
