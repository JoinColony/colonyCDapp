import React from 'react';
import clsx from 'clsx';
import {
  contributorTypes,
  permissionsTypes,
  reputationType,
  statusTypes,
} from './partials/consts';
import { FilterOptionProps, ParentFilterOption } from './types';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { FilterTypes } from '../TableFiltering/types';
import { setTeamColor } from '../TeamReputationSummary/utils';

export const followersFilterOptions: ParentFilterOption[] = [
  {
    id: 0,
    title: 'filter.user.status',
    option: 'status',
    iconName: 'flag',
    content: statusTypes,
  },
];

export const useFilterOptions = (): ParentFilterOption[] => {
  const { colony } = useColonyContext();

  const teams = (colony?.domains?.items
    ?.filter(notNull)
    .map(({ metadata, nativeId }) => {
      return {
        id: `${FilterTypes.Team}.${nativeId}`,
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
    }) ?? []) as FilterOptionProps[];

  return [
    {
      id: 0,
      title: 'filter.teams',
      option: 'team',
      iconName: 'users-three',
      content: teams,
    },
    {
      id: 1,
      title: 'filter.contributor.type',
      option: 'contributor',
      iconName: 'user',
      content: contributorTypes,
    },
    {
      id: 2,
      title: 'filter.user.status',
      option: 'status',
      iconName: 'flag',
      content: statusTypes,
    },
    {
      id: 3,
      title: 'filter.reputation',
      option: 'reputation',
      iconName: 'star-not-filled',
      content: reputationType,
    },
    {
      id: 4,
      title: 'filter.permissions',
      option: 'permissions',
      iconName: 'lock-key',
      content: permissionsTypes,
    },
  ];
};
