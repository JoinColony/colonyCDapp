import { defineMessages } from 'react-intl';

import { SearchableSortDirection } from '~types';

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

export const SortSelectOptions = [
  {
    label: SORT_MSG.newest,
    value: SearchableSortDirection.Desc,
  },
  {
    label: SORT_MSG.oldest,
    value: SearchableSortDirection.Asc,
  },
];
