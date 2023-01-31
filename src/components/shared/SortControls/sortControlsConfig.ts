import { defineMessages } from 'react-intl';

const SORT_MSG = defineMessages({
  newest: {
    id: 'dashboard.Sort.newest',
    defaultMessage: 'Newest',
  },
  oldest: {
    id: 'dashboard.Sort.oldest',
    defaultMessage: 'Oldest',
  },
});

export enum SortOptions {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
}

export const SortSelectOptions = [
  {
    label: SORT_MSG.newest,
    value: SortOptions.NEWEST,
  },
  {
    label: SORT_MSG.oldest,
    value: SortOptions.OLDEST,
  },
];
