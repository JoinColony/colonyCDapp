import clsx from 'clsx';
import addDays from 'date-fns/addDays';
import isAfter from 'date-fns/isAfter';
import subSeconds from 'date-fns/subSeconds';
import React, { type FC, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import { type ButtonMode } from '~v5/shared/Button/types.ts';

import { DATEPICKER_PORTAL_ID, DEFAULT_DATE_FORMAT } from '../common/consts.ts';
import DatepickerContainer from '../common/DatepickerContainer/index.ts';

import DatepickerCustomHeader from './partials/DatepickerCustomHeader/index.ts';
import DatepickerCustomRangeInput from './partials/DatepickerCustomRangeInput/index.ts';
import { type RangeDatepickerProps } from './types.ts';

import styles from '../common/Datepicker.module.css';

const RangeDatepicker: FC<RangeDatepickerProps> = ({
  cancelButtonProps,
  applyButtonProps,
  popperModifiers,
  onChange,
  startDate: startDateProp,
  endDate: endDateProp,
  dateFormat = DEFAULT_DATE_FORMAT,
  popperClassName,
  minYear,
  maxYear,
  withoutButtons,
  ...rest
}) => {
  const isMobile = useMobile();
  const calendarRef = useRef<DatePicker<never, true>>(null);

  const [startDate, setStartDate] = useState<Date | null>(
    startDateProp || null,
  );
  const [endDate, setEndDate] = useState<Date | null>(endDateProp || null);

  const resetValues = () => {
    setStartDate(startDateProp || null);
    setEndDate(endDateProp || null);
  };

  const {
    onClick: applyButtonOnClick,
    mode: applyButtonMode,
    text: applyButtonText,
  } = applyButtonProps || {};
  const {
    onClick: cancelButtonOnClick,
    mode: cancelButtonMode,
    text: cancelButtonText,
  } = cancelButtonProps || {};

  return (
    <DatePicker
      portalId={isMobile ? DATEPICKER_PORTAL_ID : undefined}
      calendarContainer={DatepickerContainer}
      calendarClassName={styles.wrapper}
      renderCustomHeader={(props) => (
        <DatepickerCustomHeader
          startDate={startDate}
          endDate={endDate}
          dateFormat={dateFormat}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          minYear={minYear}
          maxYear={maxYear}
          onClose={
            isMobile
              ? () => {
                  resetValues();
                  calendarRef.current?.setOpen(false);
                }
              : undefined
          }
          {...props}
        />
      )}
      ref={calendarRef}
      customInput={
        <DatepickerCustomRangeInput
          startDate={startDateProp}
          endDate={endDateProp}
          dateFormat={dateFormat}
        />
      }
      dateFormat={dateFormat}
      popperClassName={clsx(popperClassName, '!z-top max-w-[20.5rem]')}
      renderDayContents={(day) => (
        <div className="react-datepicker__day-content">{day}</div>
      )}
      shouldCloseOnSelect={false}
      popperModifiers={[
        ...(popperModifiers || []),
        {
          name: 'offset',
          options: {
            offset: [10, -38],
          },
        },
      ]}
      selectsRange
      onChange={(dates) => {
        if (!dates) {
          setStartDate(null);
          setEndDate(null);
          return;
        }

        const [start, end] = dates;

        const formattedEndDate = end ? addDays(subSeconds(end, 1), 1) : null;
        setStartDate(start);
        setEndDate(formattedEndDate);

        if (withoutButtons && start && formattedEndDate) {
          onChange([start, formattedEndDate], undefined);
          calendarRef.current?.setOpen(false);
        }
      }}
      startDate={startDate}
      endDate={endDate}
      onClickOutside={resetValues}
      {...rest}
    >
      {startDate && endDate && !withoutButtons && (
        <div className="flex w-full items-center justify-between gap-2 border-t border-t-gray-200 p-4">
          <Button
            {...cancelButtonProps}
            mode={cancelButtonMode || ('primaryOutline' as ButtonMode)}
            onClick={(event) => {
              resetValues();
              calendarRef.current?.setOpen(false);
              cancelButtonOnClick?.(event);
            }}
            text={cancelButtonText || formatText({ id: 'button.cancel' })}
            className="flex-grow"
          />
          <Button
            {...applyButtonProps}
            disabled={
              !startDate ||
              !endDate ||
              (!!endDate && !!startDate && isAfter(startDate, endDate))
            }
            mode={applyButtonMode || ('primarySolid' as ButtonMode)}
            onClick={(event) => {
              onChange([startDate, endDate], undefined);
              calendarRef.current?.setOpen(false);
              applyButtonOnClick?.(event);
            }}
            text={applyButtonText || formatText({ id: 'button.apply' })}
            className="flex-grow"
          />
        </div>
      )}
    </DatePicker>
  );
};

export default RangeDatepicker;
