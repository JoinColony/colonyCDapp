import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import format from 'date-fns/format';
import getYear from 'date-fns/getYear';
import React, { type FC, useState, useLayoutEffect } from 'react';

import { formatText } from '~utils/intl.ts';
import { range } from '~utils/lodash.ts';
import DatepickerYearDropdown from '~v5/common/Fields/datepickers/common/DatepickerYearDropdown/index.ts';
import InputBase from '~v5/common/Fields/InputBase/index.ts';

import { type DatepickerCustomHeaderProps } from './types.ts';

const DatepickerCustomHeader: FC<DatepickerCustomHeaderProps> = ({
  date,
  changeYear,
  monthDate,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  startDate,
  endDate,
  dateFormat,
  setStartDate,
  setEndDate,
  onClose,
  minYear = 1990,
  maxYear = getYear(new Date()) + 1,
}) => {
  const [startDateText, setStartDateText] = useState<string>('');
  const [endDateText, setEndDateText] = useState<string>('');

  const navigationButtonClassName =
    'flex justify-center items-center p-2 text-gray-500 transition sm:hover:text-blue-400';

  useLayoutEffect(() => {
    if (startDate) {
      setStartDateText(format(startDate, dateFormat));
    }

    if (endDate) {
      setEndDateText(format(endDate, dateFormat));
    }
  }, [startDate, setStartDate, endDate, dateFormat]);

  if (minYear > maxYear) {
    throw new Error('minYear should be less than maxYear');
  }

  if (minYear < getYear(new Date()) - 100) {
    throw new Error('minYear should be less than 100 years ago');
  }

  const years = range(minYear, maxYear);

  return (
    <div className="flex w-full flex-col gap-3 px-4 pb-3 pt-5">
      {onClose && (
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={onClose}
            className={navigationButtonClassName}
          >
            <X size={16} className="text-inherit" />
          </button>
        </div>
      )}
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className={navigationButtonClassName}
        >
          <CaretLeft size={16} className="text-inherit" />
        </button>
        <DatepickerYearDropdown
          years={years}
          selectedYear={getYear(date)}
          selectedMonth={monthDate.toLocaleString('en-US', {
            month: 'long',
          })}
          onYearClick={changeYear}
          className="flex items-center justify-center"
        />
        <button
          type="button"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className={navigationButtonClassName}
        >
          <CaretRight size={16} className="text-inherit" />
        </button>
      </div>
      <div className="flex w-full items-center justify-between gap-2 px-2">
        <InputBase
          placeholder={formatText({
            id: 'calendar.from',
          })}
          value={startDateText}
          wrapperClassName={clsx({
            'w-full': !setEndDate,
          })}
          readOnly
        />
        <span className="flex w-6 flex-shrink-0 items-center justify-center text-center text-gray-900 text-2">
          -
        </span>
        <InputBase
          placeholder={formatText({ id: 'calendar.to' })}
          value={endDateText}
          readOnly
        />
      </div>
    </div>
  );
};

export default DatepickerCustomHeader;
