import sub from 'date-fns/sub';

import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';

import { type DateOptions } from './types.ts';

export const getDateFilter = (
  dateFilter: DateOptions | undefined,
): Array<{ dateFrom: Date; dateTo: Date }> => {
  if (!dateFilter) {
    return [];
  }

  const now = new Date();
  const dateRanges: Array<{ dateFrom: Date; dateTo: Date }> = [];

  if (dateFilter.pastHour) {
    dateRanges.push({
      dateFrom: sub(now, { hours: 1 }),
      dateTo: now,
    });
  }

  if (dateFilter.pastDay) {
    dateRanges.push({
      dateFrom: sub(now, { days: 1 }),
      dateTo: now,
    });
  }

  if (dateFilter.pastWeek) {
    dateRanges.push({
      dateFrom: sub(now, { weeks: 1 }),
      dateTo: now,
    });
  }

  if (dateFilter.pastMonth) {
    dateRanges.push({
      dateFrom: sub(now, { months: 1 }),
      dateTo: now,
    });
  }

  if (dateFilter.pastYear) {
    dateRanges.push({
      dateFrom: sub(now, { years: 1 }),
      dateTo: now,
    });
  }

  if (dateFilter.custom) {
    const filteredDates = dateFilter.custom.filter(
      (date): date is string => !!date,
    );

    if (filteredDates.length === 2) {
      const [from, to] = filteredDates;
      dateRanges.push({
        dateFrom: new Date(from),
        dateTo: new Date(to),
      });
    }
  }

  return dateRanges;
};

export const getCustomDateLabel = (dateRange?: DateOptions['custom']) => {
  const [startDateString, endDateString] = dateRange || [];
  if (!startDateString || !endDateString) {
    return null;
  }

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  return `${getFormattedDateFrom(startDate)} - ${getFormattedDateFrom(endDate)}`;
};
