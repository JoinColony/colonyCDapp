import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
  contributorFilters,
  permissionsFilters,
  reputationFilters,
  statusFilters,
} from './partials/consts';
import {
  FilterOptionProps,
  NestedFilterOption,
  ParentFilterOption,
} from './types';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { FilterTypes } from '../TableFiltering/types';
import { setTeamColor } from '../TeamReputationSummary/utils';

export const followersFilterOptions: ParentFilterOption[] = [
  {
    id: 0,
    title: 'filter.user.status',
    filterType: FilterTypes.Status,
    iconName: 'flag',
    content: statusFilters,
  },
];

const getFilterOptions = (teamsFilters: FilterOptionProps[]) => [
  {
    id: 0,
    title: 'filter.teams',
    filterType: FilterTypes.Team,
    iconName: 'users-three',
    content: teamsFilters,
  },
  {
    id: 1,
    title: 'filter.contributor.type',
    filterType: FilterTypes.Contributor,
    iconName: 'user',
    content: contributorFilters,
  },
  {
    id: 2,
    title: 'filter.user.status',
    filterType: FilterTypes.Status,
    iconName: 'flag',
    content: statusFilters,
  },
  {
    id: 3,
    title: 'filter.reputation',
    filterType: FilterTypes.Reputation,
    iconName: 'star-not-filled',
    content: reputationFilters,
  },
  {
    id: 4,
    title: 'filter.permissions',
    filterType: FilterTypes.Permissions,
    iconName: 'lock-key',
    content: permissionsFilters,
  },
];

// mapping of nested filters to their parent
const getChildParentFilterMap = (filterOptions: ParentFilterOption[]) => {
  return filterOptions.reduce((acc, { filterType, content }) => {
    const childToParentMap = content.reduce(
      (mapping, { id, nestedOptions }) => {
        if (!nestedOptions) {
          return { ...mapping, [id]: filterType };
        }

        return {
          ...mapping,
          ...nestedOptions.reduce((childrenMapping, { id: childId }) => {
            return {
              ...childrenMapping,
              [childId]: filterType,
            };
          }, {}),
        };
      },
      {},
    );

    return {
      ...acc,
      ...childToParentMap,
    };
  }, {} as Record<NestedFilterOption, FilterTypes>);
};

type UseFilterOptionsReturn = {
  filterOptions: ParentFilterOption[];
  childParentFilterMap: Record<NestedFilterOption, FilterTypes>;
};

export const useFilterOptions = (): UseFilterOptionsReturn => {
  const { colony } = useColonyContext();

  const filterOptions = useMemo(() => {
    const domains = colony?.domains?.items?.filter(notNull) ?? [];

    const teamsFilters: FilterOptionProps[] = domains.map(
      ({ metadata, nativeId }) => {
        return {
          id: `${nativeId}_domain`,
          title: metadata?.name ?? nativeId.toString(),
          icon: (
            <span
              className={clsx(
                'h-[1rem] w-[1rem] rounded-[0.25rem]',
                setTeamColor(metadata?.color),
              )}
            />
          ),
        };
      },
    );

    return getFilterOptions(teamsFilters);
  }, [colony]);

  const childParentFilterMap = useMemo(
    () => getChildParentFilterMap(filterOptions),
    [filterOptions],
  );

  return {
    filterOptions,
    childParentFilterMap,
  };
};
