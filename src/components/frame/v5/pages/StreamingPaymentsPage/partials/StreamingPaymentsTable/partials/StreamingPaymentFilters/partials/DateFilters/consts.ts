import { formatText } from '~utils/intl.ts';

export const DATE_FILTERS = [
  {
    label: formatText({
      id: 'streamingPayment.table.filter.date.pastHour',
    }),
    name: 'pastHour',
  },
  {
    label: formatText({ id: 'streamingPayment.table.filter.date.pastDay' }),
    name: 'pastDay',
  },
  {
    label: formatText({
      id: 'streamingPayment.table.filter.date.pastWeek',
    }),
    name: 'pastWeek',
  },
  {
    label: formatText({
      id: 'streamingPayment.table.filter.date.pastMonth',
    }),
    name: 'pastMonth',
  },
];
