import { Flag, LockKey, Star, User } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { FilterTypes } from '../TableFiltering/types.ts';

import {
  contributorFilters,
  permissionsFilters,
  reputationFilters,
  statusFilters,
} from './partials/consts.tsx';
import { type NestedFilterOption, type ParentFilterOption } from './types.ts';

export const followersFilterOptions: ParentFilterOption[] = [
  {
    id: 0,
    title: 'filter.user.status',
    filterType: FilterTypes.Status,
    icon: Flag,
    content: statusFilters,
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
  const filterOptions = useMemo(
    () => [
      {
        id: 0,
        title: 'filter.contributor.type',
        filterType: FilterTypes.Contributor,
        icon: User,
        content: contributorFilters,
      },
      {
        id: 1,
        title: 'filter.user.status',
        filterType: FilterTypes.Status,
        icon: Flag,
        content: statusFilters,
      },
      {
        id: 2,
        title: 'filter.reputation',
        filterType: FilterTypes.Reputation,
        icon: Star,
        content: reputationFilters,
      },
      {
        id: 3,
        title: 'filter.permissions',
        filterType: FilterTypes.Permissions,
        icon: LockKey,
        content: permissionsFilters,
      },
    ],
    [],
  );

  const childParentFilterMap = useMemo(
    () => getChildParentFilterMap(filterOptions),
    [filterOptions],
  );

  return {
    filterOptions,
    childParentFilterMap,
  };
};
