import clsx from 'clsx';
import React, { type FC, useRef, useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';
import { type ButtonMode } from '~v5/shared/Button/types.ts';

import {
  DATEPICKER_PORTAL_ID,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FORMAT,
} from '../common/consts.ts';
import DatepickerContainer from '../common/DatepickerContainer/index.ts';

import DatepickerCustomHeader from './partials/DatepickerCustomHeader/DatepickerCustomHeader.tsx';
import DatepickerCustomInput from './partials/DatepickerCustomInput/DatepickerCustomInput.tsx';
import DatepickerTimePicker from './partials/DatepickerTimePicker/DatepickerTimePicker.tsx';
import { type DatepickerWithTimeProps } from './types.ts';
import { daysFromRefDate } from './utils.ts';

import styles from '../common/Datepicker.module.css';

const maxTimeMinDay = new Date().setHours(23, 59, 0, 0);
const minTimeMaxDay = new Date().setHours(0, 0, 0, 0);

const DatepickerWithTime: FC<DatepickerWithTimeProps> = ({
  cancelButtonProps,
  applyButtonProps,
  popperModifiers,
  onChange,
  selected: selectedProp,
  dateFormat = DEFAULT_DATE_TIME_FORMAT,
  popperClassName,
  minYear,
  maxYear,
  customInput,
  inline,
  withCloseButton,
  onClose,
  minDate = new Date('1970-01-01'),
  maxDate = new Date('99999-01-01'),
  ...rest
}) => {
  const isMobile = useMobile();
  const calendarRef = useRef<DatePicker>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    selectedProp || null,
  );
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    selectedProp || null,
  );

  const minDays = useMemo(() => daysFromRefDate(minDate), [minDate]);
  const maxDays = useMemo(() => daysFromRefDate(maxDate), [maxDate]);
  const selDays = useMemo(() => daysFromRefDate(selectedDate), [selectedDate]);

  const isMinDay = selDays === minDays;
  const isMaxDay = selDays === maxDays;

  const maxDayMinTime = isMaxDay ? new Date(minTimeMaxDay) : null;
  const maxDayMaxTime = isMinDay ? new Date(maxTimeMinDay) : null;

  const minTime = isMinDay ? minDate : maxDayMinTime;
  const maxTime = isMaxDay ? maxDate : maxDayMaxTime;

  const resetValues = () => {
    setSelectedDate(selectedProp || null);
    setSelectedTime(selectedProp || null);
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
      calendarContainer={inline ? undefined : DatepickerContainer}
      calendarClassName={clsx(styles.wrapper, styles['wrapper--simple'])}
      renderCustomHeader={(props) => (
        <DatepickerCustomHeader
          startDate={selectedDate}
          dateFormat={DEFAULT_DATE_FORMAT}
          setStartDate={setSelectedDate}
          minYear={minYear}
          maxYear={maxYear}
          inline={inline}
          onClose={
            isMobile && withCloseButton
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
      customInput={customInput || <DatepickerCustomInput />}
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
      selectsRange={false}
      onChange={(date, event) => {
        date?.setHours(
          selectedTime?.getHours() || 0,
          selectedTime?.getMinutes() || 0,
          0,
          0,
        );
        setSelectedDate(date);

        if (isMobile) {
          return;
        }

        onChange(date, event);
      }}
      selected={selectedDate}
      showTimeInput
      onBlur={(event) => {
        if (isMobile || !selectedDate) {
          return;
        }

        onChange(selectedDate, event);
        onClose?.();
      }}
      minDate={minDate}
      maxDate={maxDate}
      minTime={minTime ?? undefined}
      maxTime={maxTime ?? undefined}
      customTimeInput={
        <div className="react-datepicker-ignore-onclickoutside relative">
          <DatepickerTimePicker
            onChange={(date, event) => {
              const hours = date?.getHours() || 0;
              const minutes = date?.getMinutes() || 0;

              selectedDate?.setHours(hours, minutes, 0, 0);

              setSelectedTime(selectedDate ?? date);
              setSelectedDate(selectedDate ?? date);

              if (event) {
                return;
              }

              if (!isMobile) {
                onChange(selectedDate ?? date, event);
                onClose?.();
              }
            }}
            minDate={minDate}
            maxDate={maxDate}
            minTime={minTime ?? undefined}
            maxTime={maxTime ?? undefined}
            onBlur={(event) => {
              if (isMobile) {
                return;
              }

              onChange(selectedDate, event);
              onClose?.();
            }}
            selected={selectedTime}
          />
        </div>
      }
      inline={inline}
      {...rest}
    >
      {selectedDate && isMobile && (
        <div className="flex w-full items-center justify-between gap-2 border-t border-t-gray-200 p-4">
          <Button
            {...cancelButtonProps}
            mode={cancelButtonMode || ('primaryOutline' as ButtonMode)}
            onClick={(event) => {
              resetValues();
              calendarRef.current?.setOpen(false);
              cancelButtonOnClick?.(event);
              onClose?.();
            }}
            text={cancelButtonText || formatText({ id: 'button.cancel' })}
            className="flex-grow"
          />
          <Button
            {...applyButtonProps}
            mode={applyButtonMode || ('primarySolid' as ButtonMode)}
            onClick={(event) => {
              onChange(selectedDate, undefined);
              calendarRef.current?.setOpen(false);
              applyButtonOnClick?.(event);
              onClose?.();
            }}
            text={applyButtonText || formatText({ id: 'button.apply' })}
            className="flex-grow"
          />
        </div>
      )}
    </DatePicker>
  );
};

export default DatepickerWithTime;
