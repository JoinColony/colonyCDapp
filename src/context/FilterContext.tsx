import { Id } from '@colony/colony-js';
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import { useLocation } from 'react-router-dom';
import { SortingMethod, FilteringMethod } from '~gql';
import { SetStateFn } from '~types';
import { useFilterOptions } from '~v5/common/Filter/consts';
import {
  ParentFilterOption,
  NestedFilterOption,
} from '~v5/common/Filter/types';
import {
  FilterType,
  FilterTypes,
  ReputationSortTypes,
} from '~v5/common/TableFiltering/types';

type SelectedFilterLabel = { [k: string]: string[] };
export type SelectedFiltersMap = {
  [K in FilterType]: Map<string, NestedFilterInfo>;
};

export const FilterContext = createContext<
  | {
      selectedFilterLabels: SelectedFilterLabel[];
      handleClearFilters: (parents?: FilterType[]) => void;
      handleFilterSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
      selectedDomainIds: number[];
      filterOptions: ParentFilterOption[];
      selectedFilters: SelectedFiltersMap;
      sortingMethod: SortingMethod;
      filteringMethod: FilteringMethod;
      selectedFilterCount: number;
      setFilteringMethod: SetStateFn;
      isFilterChecked: (
        parentFilter: FilterType,
        nestedFilter: NestedFilterOption,
      ) => boolean;
    }
  | undefined
>(undefined);

interface NestedFilterInfo {
  label: string;
  isChecked: boolean;
}

const getInitialFiltersRecord = (filterOptions: ParentFilterOption[]) => {
  const initialFilters = filterOptions.reduce((acc, { option }) => {
    acc[option] = new Map();
    return acc;
  }, {} as SelectedFiltersMap);

  // default Root to true in Team filter
  initialFilters[FilterTypes.Team].set('1', {
    label: 'Root',
    isChecked: true,
  });

  return initialFilters;
};

export const FilterContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const filterOptions = useFilterOptions();
  const { pathname } = useLocation();
  const isFollowersPage = pathname.split('/').at(-1) === 'followers';

  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersMap>(
    () => getInitialFiltersRecord(filterOptions),
  );
  const [selectedFilterCount, setSelectedFilterCount] = useState<number>(1);

  const [filteringMethod, setFilteringMethod] = useState<FilteringMethod>(
    FilteringMethod.Union,
  );

  const selectedFilterLabels = Object.entries(selectedFilters).reduce<
    SelectedFilterLabel[]
  >((acc, [parentFilterLabel, nestedFilterInfo]) => {
    const selectedKeys = [...nestedFilterInfo.keys()]
      .map((key) => nestedFilterInfo.get(key)?.label)
      .filter((label): label is string => !!label);

    acc.push({ [parentFilterLabel]: selectedKeys });
    return acc;
  }, []);

  const handleFilterSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [parentFilter, nestedFilter] = event.target.id.split('.');

      const isChecked = event.target.checked;

      if (isChecked) {
        setSelectedFilters((prevState) => {
          const parentFilterMap = prevState[parentFilter];
          // cannot check both reputation filters at once
          if (
            parentFilter === FilterTypes.Reputation &&
            prevState[parentFilter].size
          ) {
            parentFilterMap.clear();
            setSelectedFilterCount((prevCount) => prevCount - 1);
          }

          parentFilterMap.set(nestedFilter, {
            label:
              parentFilter === FilterTypes.Team
                ? event.target.name
                : { id: `filter.pill.${nestedFilter}` },
            isChecked: true,
          });

          const updated = {
            ...prevState,
            [parentFilter]: new Map(parentFilterMap),
          };

          return updated;
        });

        setSelectedFilterCount((prevCount) => prevCount + 1);
      } else {
        setSelectedFilters((prevState) => {
          const parentFilterMap = prevState[parentFilter];
          parentFilterMap.delete(nestedFilter);

          return {
            ...prevState,
            [parentFilter]: new Map(parentFilterMap),
          };
        });
        setSelectedFilterCount((prevState) => prevState - 1);
      }
    },
    [],
  );

  const isFilterChecked = useCallback(
    (parentFilter: FilterType, nestedFilter: NestedFilterOption) =>
      !!selectedFilters[parentFilter ?? '']?.get(nestedFilter)?.isChecked,
    [selectedFilters],
  );

  const handleClearFilters = useCallback(
    (parents: FilterType[]) => {
      let removedFilters = 0;
      setSelectedFilters((prevState) => {
        const updatedFilters = parents.reduce((acc, parent) => {
          const nestedFilter = prevState[parent];
          const updatedFilter = new Map(nestedFilter);
          removedFilters += updatedFilter.size;
          updatedFilter.clear();

          if (parent === FilterTypes.Team && isFollowersPage) {
            removedFilters -= 1;
            updatedFilter.set('1', {
              label: 'Root',
              isChecked: true,
            });
          }

          return {
            ...acc,
            [parent]: updatedFilter,
          };
        }, {});

        return {
          ...prevState,
          ...updatedFilters,
        };
      });
      setSelectedFilterCount((prevState) => prevState - removedFilters);
    },
    [isFollowersPage],
  );

  //  reset filters when switching to followers page, due to reduced selection
  useEffect(() => {
    if (isFollowersPage) {
      handleClearFilters([
        'contributor',
        'team',
        'reputation',
        'permissions',
        'latest',
      ]);
    }
  }, [isFollowersPage, handleClearFilters]);

  const selectedDomainIds = useMemo(() => {
    const ids = [...selectedFilters[FilterTypes.Team].keys()].map(
      (nativeDomainId) => Number(nativeDomainId),
    );
    return ids.length ? ids : [Id.RootDomain];
  }, [selectedFilters]);

  const sortingMethod = useMemo(() => {
    const sort = [...selectedFilters[FilterTypes.Reputation].keys()].pop();
    return sort === ReputationSortTypes.ASC
      ? SortingMethod.ByLowestRep
      : SortingMethod.ByHighestRep;
  }, [selectedFilters]);

  const value = useMemo(
    () => ({
      selectedFilterLabels,
      handleClearFilters,
      handleFilterSelect,
      filterOptions,
      selectedFilters,
      selectedDomainIds,
      sortingMethod,
      filteringMethod,
      selectedFilterCount,
      setFilteringMethod,
      isFilterChecked,
    }),
    [
      selectedFilterLabels,
      handleClearFilters,
      handleFilterSelect,
      filterOptions,
      selectedFilters,
      selectedDomainIds,
      sortingMethod,
      filteringMethod,
      selectedFilterCount,
      setFilteringMethod,
      isFilterChecked,
    ],
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error(
      'useMemberFilterContext must be used within a MemberFilterContextProvider',
    );
  }
  return context;
};
