import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import { useLocation } from 'react-router-dom';

import {
  CUSTOM_USER_ROLE,
  type UserRole,
  USER_ROLES,
} from '~constants/permissions.ts';
import { ModelSortDirection } from '~gql';
import { useFilterOptions } from '~v5/common/Filter/consts.tsx';
import {
  type ParentFilterOption,
  type NestedFilterOption,
} from '~v5/common/Filter/types.ts';
import {
  type ContributorTypeFilter,
  type FilterType,
  FilterTypes,
  PermissionToNetworkIdMap,
  ReputationSort,
  type StatusType,
} from '~v5/common/TableFiltering/types.ts';

type SelectedFilterLabel = { [k: string]: string[] };
export type SelectedFiltersMap = {
  [K in FilterType]: Map<string, NestedFilterInfo>;
};

export const FilterContext = createContext<
  | {
      getSelectedFilterLabels: () => SelectedFilterLabel[];
      handleClearFilters: (parents?: FilterType[]) => void;
      handleFilterSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

interface NestedFilterInfo {
  label: string;
  isChecked: boolean;
}

const getInitialFiltersRecord = (filterOptions: ParentFilterOption[]) => {
  const initialFilters = filterOptions.reduce((acc, { filterType }) => {
    acc[filterType] = new Map();
    return acc;
  }, {} as SelectedFiltersMap);

  return initialFilters;
};

export const FilterContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();
  const { filterOptions, childParentFilterMap } = useFilterOptions();
  const [selectedFilterCount, setSelectedFilterCount] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersMap>(
    () => getInitialFiltersRecord(filterOptions),
  );

  const isFollowersPage = pathname.split('/').at(-1) === 'contributors';

  const getSelectedFilterLabels = useCallback(
    () =>
      Object.entries(selectedFilters).reduce<SelectedFilterLabel[]>(
        (acc, [parentFilterLabel, nestedFilterInfo]) => {
          const selectedKeys = [...nestedFilterInfo.keys()]
            .map((key) => nestedFilterInfo.get(key)?.label)
            .filter((label): label is string => !!label);

          acc.push({ [parentFilterLabel]: selectedKeys });
          return acc;
        },
        [],
      ),
    [selectedFilters],
  );

  const handleFilterSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nestedFilter = event.target.id;
      const parentFilter = childParentFilterMap[nestedFilter];
      const isChecked = event.target.checked;

      if (isChecked) {
        setSelectedFilters((prevState) => {
          const parentFilterMap = prevState[parentFilter];
          // cannot check both reputation or status filters at once
          if (
            (parentFilter === FilterTypes.Reputation ||
              parentFilter === FilterTypes.Status) &&
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
    [childParentFilterMap],
  );

  const isFilterChecked = useCallback(
    (nestedFilter: NestedFilterOption) => {
      const parentFilter = childParentFilterMap[nestedFilter];
      return !!selectedFilters[parentFilter ?? '']?.get(nestedFilter)
        ?.isChecked;
    },
    [selectedFilters, childParentFilterMap],
  );

  const handleClearFilters = useCallback((parents: FilterType[]) => {
    let removedFilters = 0;
    setSelectedFilters((prevState) => {
      const updatedFilters = parents.reduce((acc, parent) => {
        const nestedFilter = prevState[parent];
        const updatedFilter = new Map(nestedFilter);
        removedFilters += updatedFilter.size;
        updatedFilter.clear();

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
  }, []);

  const getFilterPermissions = useCallback(() => {
    return [...selectedFilters[FilterTypes.Permissions].keys()].reduce<
      Record<UserRole, number[]>
    >((acc, permission) => {
      const permissions = USER_ROLES.find(({ role }) => role === permission);

      if (permissions) {
        acc[permissions.name] = permissions.permissions;
      } else {
        acc[CUSTOM_USER_ROLE.name] = [
          ...(acc[CUSTOM_USER_ROLE.name] || []),
          PermissionToNetworkIdMap[permission],
        ];
      }

      return acc;
    }, {} as Record<UserRole, number[]>);
  }, [selectedFilters]);

  const getFilterStatus = useCallback(
    () =>
      [...selectedFilters[FilterTypes.Status].keys()].pop() as
        | StatusType
        | undefined,
    [selectedFilters],
  );

  const getFilterContributorType = useCallback(
    () =>
      [
        ...selectedFilters[FilterTypes.Contributor].keys(),
      ] as ContributorTypeFilter[],
    [selectedFilters],
  );

  const getSortingMethod = useCallback(() => {
    const sort = [...selectedFilters[FilterTypes.Reputation].keys()].pop();
    return sort === ReputationSort.ASC
      ? ModelSortDirection.Asc
      : ModelSortDirection.Desc;
  }, [selectedFilters]);

  //  reset filters when switching to followers page, due to reduced selection
  useEffect(() => {
    if (isFollowersPage) {
      handleClearFilters([
        'contributor',
        'reputation',
        'permissions',
        'latest',
      ]);
    }
  }, [isFollowersPage, handleClearFilters]);

  const value = useMemo(
    () => ({
      getSelectedFilterLabels,
      handleClearFilters,
      handleFilterSelect,
      filterOptions,
      getSortingMethod,
      getFilterPermissions,
      getFilterStatus,
      getFilterContributorType,
      selectedFilterCount,
      isFilterChecked,
    }),
    [
      getSelectedFilterLabels,
      handleClearFilters,
      handleFilterSelect,
      filterOptions,
      getSortingMethod,
      getFilterPermissions,
      getFilterStatus,
      getFilterContributorType,
      selectedFilterCount,
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
      'useFilterContext must be used within the FilterContextProvider',
    );
  }
  return context;
};
