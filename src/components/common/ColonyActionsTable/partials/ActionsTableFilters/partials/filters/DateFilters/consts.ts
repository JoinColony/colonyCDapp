import { formatText } from '~utils/intl.ts';

export const DATE_FILTERS = [
  {
    label: formatText({
      id: 'activityFeedTable.filters.date.pastHour',
    }),
    name: 'pastHour',
  },
  {
    label: formatText({ id: 'activityFeedTable.filters.date.pastDay' }),
    name: 'pastDay',
  },
  {
    label: formatText({
      id: 'activityFeedTable.filters.date.pastWeek',
    }),
    name: 'pastWeek',
  },
  {
    label: formatText({
      id: 'activityFeedTable.filters.date.pastMonth',
    }),
    name: 'pastMonth',
  },
];
