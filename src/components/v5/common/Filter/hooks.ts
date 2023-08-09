import { useMemo } from 'react';
import { useTeams } from '~hooks/useTeams';
import { ParentFilterOption } from './types';
import {
  contributorTypes,
  permissionsTypes,
  reputationType,
  statusTypes,
} from './partials/consts';

export const useFilter = () => {
  const teamsOptions = useTeams();

  const filterOptions: ParentFilterOption[] = useMemo(
    () => [
      {
        id: 0,
        title: 'filter.teams',
        option: 'team',
        iconName: 'users-three',
        content: teamsOptions.options,
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
    ],
    [teamsOptions],
  );

  return filterOptions;
};
