import sub from 'date-fns/sub';

import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';

import { type StreamingPaymentFilters, type DateOptions } from './types.ts';

export const getDateFilter = (
  dateFilter: DateOptions | undefined,
  currentDate?: Date,
): Pick<StreamingPaymentFilters, 'dateFrom' | 'dateTo'> | undefined => {
  if (!dateFilter) {
    return undefined;
  }

  const now = currentDate ?? new Date();
  const baseFilter = {
    dateTo: now,
  };

  switch (true) {
    case !!dateFilter.custom: {
      const filteredDates = dateFilter.custom?.filter(
        (date): date is string => !!date,
      );

      if (!filteredDates) {
        return undefined;
      }

      const [from, to] = filteredDates;

      return {
        dateFrom: new Date(from),
        dateTo: new Date(to),
      };
    }
    case dateFilter.pastYear: {
      return {
        dateFrom: sub(now, { years: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastMonth: {
      return {
        dateFrom: sub(now, { months: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastWeek: {
      return {
        dateFrom: sub(now, { weeks: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastDay: {
      return {
        dateFrom: sub(now, { days: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastHour: {
      return {
        dateFrom: sub(now, { hours: 1 }),
        ...baseFilter,
      };
    }
    default: {
      return undefined;
    }
  }
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
