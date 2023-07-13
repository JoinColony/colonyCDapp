import { contributorTypes, statusTypes } from './partials/consts';
import { ParentFilterOption } from './types';

export const filterOptions: ParentFilterOption[] = [
  {
    id: 0,
    title: 'filter.teams',
    option: 'team',
    iconName: 'users-three',
    content: 'content',
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
    content: 'content',
  },
  {
    id: 4,
    title: 'filter.permissions',
    option: 'permissions',
    iconName: 'lock-key',
    content: 'content',
  },
];
