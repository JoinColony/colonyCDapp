import { createContext, useContext } from 'react';

import { type CoreAction } from '~actions/index.ts';
import { type DecisionMethod } from '~gql';
import { type ActivityFeedFilters } from '~hooks/useActivityFeed/types.ts';
import { type MotionState } from '~utils/colonyMotions.ts';

import { type DateOptions } from '../partials/ActionsTableFilters/types.ts';

import { type FiltersValues } from './types.ts';

import type React from 'react';

export interface FiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  motionStates: MotionState[];
  decisionMethods: DecisionMethod[];
  actionTypesFilters: CoreAction[];
  dateFilters: DateOptions;
  activeFilters: ActivityFeedFilters;
  selectedFiltersCount: number;
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
