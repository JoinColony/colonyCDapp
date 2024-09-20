import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import { type ReactNode } from 'react';

import { getFormattedDateFrom } from './getFormattedDateFrom.ts';
import { formatText, intl } from './intl.ts';

const { formatDate: intlFormatDate } = intl<ReactNode>();

export const formatDate = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (isToday(date)) {
    return formatText(
      { id: 'action.createdAt.todayAt' },
      {
        time: intlFormatDate(date, {
          hour: 'numeric',
          minute: 'numeric',
        }),
      },
    );
  }

  if (isYesterday(date)) {
    return formatText(
      { id: 'action.createdAt.yesterdayAt' },
      {
        time: intlFormatDate(date, {
          hour: 'numeric',
          minute: 'numeric',
        }),
      },
    );
  }

  return formatText(
    {
      id: 'action.createdAt.at',
    },
    {
      date: getFormattedDateFrom(value),
      time: intlFormatDate(date, {
        hour: 'numeric',
        minute: 'numeric',
      }),
    },
  );
};
