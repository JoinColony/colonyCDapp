import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
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
  dateFormat,
  setStartDate,
  onClose,
  minYear = 1990,
  maxYear = getYear(new Date()) + 1,
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
  }, [startDate, setStartDate, dateFormat]);

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
            id: 'calendar.selectDate',
          })}
          value={startDateText}
          wrapperClassName="w-full"
          readOnly
        />
      </div>
    </div>
  );
};

export default DatepickerCustomHeader;
