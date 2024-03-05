import { formatText } from '~utils/intl.ts';

export const DATE_FILTERS = [
  {
    label: formatText({
      id: 'agreementsPage.filters.date.pastHour',
    }),
    name: 'pastHour',
  },
  {
    label: formatText({ id: 'agreementsPage.filters.date.pastDay' }),
    name: 'pastDay',
  },
  {
    label: formatText({
      id: 'agreementsPage.filters.date.pastWeek',
    }),
    name: 'pastWeek',
  },
  {
    label: formatText({
      id: 'agreementsPage.filters.date.pastMonth',
    }),
    name: 'pastMonth',
  },
];
