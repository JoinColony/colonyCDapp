import { createContext, useContext } from 'react';

import { type MotionState } from '~utils/colonyMotions.ts';

import {
  type AgreementsPageFilters,
  type DateOptions,
} from '../partials/AgreementsPageFilters/types.ts';

import type React from 'react';

interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  motionStates: MotionState[];
  activeFilters: AgreementsPageFilters;
  selectedFiltersCount: number;
  dateFilters: DateOptions;
  handleMotionStatesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDateFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomDateFilterChange: (date: [Date | null, Date | null]) => void;
  handleResetFilters: (category: string) => void;
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
