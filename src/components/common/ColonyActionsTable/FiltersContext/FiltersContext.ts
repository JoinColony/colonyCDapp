import { createContext, useContext } from 'react';

import { type Action } from '~constants/actions.ts';
import {
  type ActivityFeedFilters,
  type ActivityDecisionMethod,
} from '~hooks/useActivityFeed/types.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

import { type DateOptions } from '../partials/ActionsTableFilters/types.ts';

import { type FiltersValues } from './types.ts';

import type React from 'react';

export interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  motionStates: MotionState[];
  decisionMethods: ActivityDecisionMethod[];
  actionTypesFilters: Action[];
  dateFilters: DateOptions;
  activeFilters: ActivityFeedFilters;
  selectedFiltersCount: number;
  chainIdFilters: string[];
  handleActionTypesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDecisionMethodsFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleMotionStatesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDateFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomDateFilterChange: (date: [Date | null, Date | null]) => void;
  handleResetFilters: (filter: FiltersValues) => void;
  handleChainIdFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
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
