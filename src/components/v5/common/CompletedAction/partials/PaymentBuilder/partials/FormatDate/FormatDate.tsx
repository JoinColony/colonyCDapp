import { isToday, isYesterday } from 'date-fns';
import React, { type FC } from 'react';
import { FormattedDate, defineMessages } from 'react-intl';

import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';
import { formatText } from '~utils/intl.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.FormattedDate';

const MSG = defineMessages({
  todayAt: {
    id: `${displayName}.todayAt`,
    defaultMessage: 'Today at',
  },
  yestardayAt: {
    id: `${displayName}.yestardayAt`,
    defaultMessage: 'Yesterday at',
  },
  at: {
    id: `${displayName}.at`,
    defaultMessage: 'at',
  },
});

interface FormattedDateProps {
  value: string | undefined;
}

const FormatDate: FC<FormattedDateProps> = ({ value }) => {
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

export default FormatDate;
