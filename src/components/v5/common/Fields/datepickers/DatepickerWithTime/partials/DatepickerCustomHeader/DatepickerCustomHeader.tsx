import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import format from 'date-fns/format';
import getYear from 'date-fns/getYear';
import React, { type FC, useState, useLayoutEffect } from 'react';

import { formatText } from '~utils/intl.ts';
import { range } from '~utils/lodash.ts';
import InputBase from '~v5/common/Fields/InputBase/index.ts';

import DatepickerYearDropdown from '../../../common/DatepickerYearDropdown/index.ts';

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
  dateFormat,
  setStartDate,
  onClose,
  minYear = 1990,
  maxYear = getYear(new Date()) + 1,
  inline,
}) => {
  const [startDateText, setStartDateText] = useState<string>('');
  // @todo: check min and max
  const years = range(minYear, maxYear);
  const navigationButtonClassName =
    'flex justify-center items-center p-2 text-gray-500 transition sm:hover:text-blue-400';

  useLayoutEffect(() => {
    if (startDate) {
      setStartDateText(format(startDate, dateFormat));
    }
  }, [startDate, dateFormat]);

  return (
    <div
      className={clsx('flex w-full flex-col gap-3 pb-3', {
        'px-4 pt-5': !inline,
        'px-4': inline,
      })}
    >
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
            id: 'calendar.selectDate',
          })}
          value={startDateText}
          wrapperClassName="w-full"
          readOnly
        />
        <button
          type="button"
          className="rounded border border-gray-300 bg-base-white px-3.5 py-2 text-md text-gray-700 transition disabled:text-gray-300
    md:hover:border-gray-900 md:hover:bg-base-white md:hover:text-gray-900"
          onClick={() => setStartDate(new Date())}
        >
          {formatText({ id: 'calendar.today' })}
        </button>
      </div>
    </div>
  );
};

export default DatepickerCustomHeader;
