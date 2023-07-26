import {
  contributorTypes,
  permissionsTypes,
  reputationType,
  statusTypes,
  teamTypes,
} from './partials/consts';
import { ParentFilterOption } from './types';

export const followersFilterOptions: ParentFilterOption[] = [
  {
    id: 0,
    title: 'filter.user.status',
    option: 'status',
    iconName: 'flag',
    content: statusTypes,
  },
];

export const filterOptions: ParentFilterOption[] = [
  {
    id: 0,
    title: 'filter.teams',
    option: 'team',
    iconName: 'users-three',
    content: teamTypes,
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
