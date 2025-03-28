import { createContext, useContext } from 'react';

import {
  type ModelSortDirection,
  type StreamingPaymentEndCondition,
} from '~gql';
import { type StreamingPaymentStatus } from '~types/streamingPayments.ts';

import {
  type StreamingPaymentFilters,
  type DateOptions,
} from '../partials/StreamingPaymentFilters/types.ts';

import { type TokenTypes } from './types.ts';

import type React from 'react';

interface StreamingFiltersContextValue {
  searchFilter: string;
  setSearchFilter: (searchValue: string) => void;
  statuses: StreamingPaymentStatus[];
  endConditions: StreamingPaymentEndCondition[];
  tokenTypes: TokenTypes;
  dateFilters: DateOptions;
  activeFilters: StreamingPaymentFilters;
  totalStreamedFilters: ModelSortDirection | undefined;
  selectedFiltersCount: number;
  handleStatusesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleEndConditionsFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleTokenTypesFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleTotalStreamedFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDateFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomDateFilterChange: (date: [Date | null, Date | null]) => void;
  handleResetFilters: (category: string) => void;
}

export const StreamingFiltersContext = createContext<
  StreamingFiltersContextValue | undefined
>(undefined);

export const useStreamingFiltersContext = () => {
  const context = useContext(StreamingFiltersContext);
  if (context === undefined) {
    throw new Error(
      'useFiltersContext must be used within the StreamingFiltersContextProvider',
    );
  }
  return context;
};
