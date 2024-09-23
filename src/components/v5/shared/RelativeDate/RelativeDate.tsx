import { isToday, isYesterday } from 'date-fns';
import React, { type FC } from 'react';
import { defineMessages, FormattedDate } from 'react-intl';

import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';

interface RelativeDateProps {
  value: string | number | undefined;
}

const MSG = defineMessages({
  todayAt: {
    id: `todayAt`,
    defaultMessage: 'Today at',
  },
  yestardayAt: {
    id: `yestardayAt`,
    defaultMessage: 'Yesterday at',
  },
  at: {
    id: `at`,
    defaultMessage: 'at',
  },
});

const RelativeDate: FC<RelativeDateProps> = ({ value }) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (isToday(date)) {
    return (
      <>
        {formatText(MSG.todayAt)}{' '}
        <FormattedDate value={date} hour="numeric" minute="numeric" />
      </>
    );
  }

  if (isYesterday(date)) {
    return (
      <>
        {formatText(MSG.yestardayAt)}{' '}
        <FormattedDate value={date} hour="numeric" minute="numeric" />
      </>
    );
  }

  return (
    <>
      {getFormattedDateFrom(value)} {formatText(MSG.at)}{' '}
      <FormattedDate value={date} hour="numeric" minute="numeric" />
    </>
  );
};

export default RelativeDate;
