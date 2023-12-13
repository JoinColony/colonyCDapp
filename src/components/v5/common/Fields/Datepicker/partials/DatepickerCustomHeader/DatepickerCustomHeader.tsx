import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import getYear from 'date-fns/getYear';
import format from 'date-fns/format';
import isMatch from 'date-fns/isMatch';
import parse from 'date-fns/parse';
import clsx from 'clsx';

import { range } from '~utils/lodash';
import InputBase from '~v5/common/Fields/InputBase';
import { formatText } from '~utils/intl';

import DatepickerYearDropdown from '../DatepickerYearDropdown';
import { DatepickerCustomHeaderProps } from './types';

const years = range(1990, getYear(new Date()) + 1, 1);

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
}) => {
  const [startDateText, setStartDateText] = useState<string>('');
  const [endDateText, setEndDateText] = useState<string>('');
  const navigationButtonClassName =
    'flex justify-center items-center p-2 text-gray-500 transition sm:hover:text-blue-400';

  const makeChangeHandler =
    (
      setDateValue: (dateParam: Date) => void,
      setTextValue: (dateText: string) => void,
    ): ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      const { value } = event.target;

      setTextValue(value);

      if (!isMatch(value, dateFormat)) {
        return;
      }

      const parsedDate = parse(value, dateFormat, new Date());

      setDateValue(parsedDate);
    };

  useEffect(() => {
    if (startDate) {
      setStartDateText(format(startDate, dateFormat));
    }

    if (endDate) {
      setEndDateText(format(endDate, dateFormat));
    }
  }, [startDate, setStartDate, endDate, dateFormat]);

  return (
    <div className="w-full pt-5 pb-3 px-4 flex flex-col gap-3">
      <div className="w-full flex justify-between items-center gap-2">
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
      <div className="w-full flex items-center justify-between gap-2 px-2">
        <InputBase
          placeholder={formatText({
            id: setEndDate ? 'calendar.from' : 'calendar.selectDate',
          })}
          value={startDateText}
          onChange={makeChangeHandler(setStartDate, setStartDateText)}
          wrapperClassName={clsx({
            'w-full': !setEndDate,
          })}
        />
        {setEndDate && (
          <>
            <span className="flex justify-center items-center flex-shrink-0 text-gray-900 text-2 w-6 text-center">
              -
            </span>
            <InputBase
              placeholder={formatText({ id: 'calendar.to' })}
              value={endDateText}
              onChange={makeChangeHandler(setEndDate, setEndDateText)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DatepickerCustomHeader;
