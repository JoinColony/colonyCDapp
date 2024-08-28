import { format, setMonth } from 'date-fns';

import { type BarChartDataItem } from './types.ts';

export const getMonthShortName = (month: string) => {
  const parsedMonth = parseInt(month, 10) - 1;

  const now = Date.now();

  return format(new Date(setMonth(now, parsedMonth)), 'MMM');
};

export const sortByLabel = (a: BarChartDataItem, b: BarChartDataItem) =>
  parseInt(a.label ?? '', 10) - parseInt(b.label ?? '', 10);
