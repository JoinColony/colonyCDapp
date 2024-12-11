import { ModelSortDirection } from '~gql';
import { formatText } from '~utils/intl.ts';

export const TOTAL_STREAMED_FILTERS = [
  {
    label: formatText({ id: 'streamingPayment.table.filter.descending' }),
    name: ModelSortDirection.Desc,
  },
  {
    label: formatText({ id: 'streamingPayment.table.filter.ascending' }),
    name: ModelSortDirection.Asc,
  },
];
