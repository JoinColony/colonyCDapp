import { type ChangeEvent, createContext, useContext } from 'react';

import { type UserRole } from '~constants/permissions.ts';
import { type ModelSortDirection } from '~gql';
import {
  type ParentFilterOption,
  type NestedFilterOption,
} from '~v5/common/Filter/types.ts';
import {
  type ContributorTypeFilter,
  type FilterType,
  type StatusType,
} from '~v5/common/TableFiltering/types.ts';

interface NestedFilterInfo {
  label: string;
  isChecked: boolean;
}

export type SelectedFilterLabel = { [k: string]: string[] };

export type SelectedFiltersMap = {
  [K in FilterType]: Map<string, NestedFilterInfo>;
};

export const FilterContext = createContext<
  | {
      getSelectedFilterLabels: () => SelectedFilterLabel[];
      handleClearFilters: (parents?: FilterType[]) => void;
      handleFilterSelect: (event: ChangeEvent<HTMLInputElement>) => void;
      getSortingMethod: () => ModelSortDirection;
      getFilterPermissions: () => Record<UserRole, number[]>;
      getFilterStatus: () => StatusType | undefined;
      getFilterContributorType: () => ContributorTypeFilter[];
      filterOptions: ParentFilterOption[];
      selectedFilterCount: number;
      isFilterChecked: (nestedFilter: NestedFilterOption) => boolean;
    }
  | undefined
>(undefined);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error(
      'useFilterContext must be used within the FilterContextProvider',
    );
  }
  return context;
};
