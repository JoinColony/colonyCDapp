import { statusTypes } from './partials/consts';
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
