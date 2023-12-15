import isAfter from 'date-fns/isAfter';
import React, { useCallback, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';
import { ButtonMode } from '~v5/shared/Button/types';

import { DATEPICKER_PORTAL_ID, DEFAULT_DATE_FORMAT } from './consts';
import DatepickerContainer from './partials/DatepickerContainer';
import DatepickerCustomHeader from './partials/DatepickerCustomHeader';
import DatepickerCustomInput from './partials/DatepickerCustomInput';
import DatepickerCustomRangeInput from './partials/DatepickerCustomRangeInput';
import { DatepickerProps } from './types';

import styles from './Datepicker.css';

const Datepicker = <T extends boolean = false>({
  cancelButtonProps,
  applyButtonProps,
  popperModifiers,
  selectsRange,
  onChange,
  startDate: startDateProp,
  endDate: endDateProp,
  selected: selectedProp,
  dateFormat = DEFAULT_DATE_FORMAT,
  ...rest
}: DatepickerProps<T>): ReturnType<React.FC> => {
  const isMobile = useMobile();
  const calendarRef = useRef<DatePicker<never, T>>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChange: DatepickerProps<T>['onChange'] = useCallback(
    (dates) => {
      if (!dates && selectsRange) {
        setStartDate(null);
        setEndDate(null);
        return;
      }

      if (Array.isArray(dates)) {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
      } else {
        setStartDate(dates);
      }
    },
    [selectsRange],
  );

  const resetValues = useCallback(() => {
    if (selectsRange) {
      setStartDate(startDateProp || null);
      setEndDate(endDateProp || null);
    } else {
      setStartDate(selectedProp || null);
      setEndDate(null);
    }
  }, [endDateProp, selectedProp, selectsRange, startDateProp]);

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
    <DatePicker<never, T>
      portalId={isMobile ? DATEPICKER_PORTAL_ID : undefined}
      calendarContainer={DatepickerContainer}
      calendarClassName={styles.wrapper}
      renderCustomHeader={(props) => (
        <DatepickerCustomHeader
          startDate={startDate}
          endDate={selectsRange ? endDate : null}
          dateFormat={dateFormat}
          setStartDate={setStartDate}
          setEndDate={selectsRange ? setEndDate : undefined}
          {...props}
        />
      )}
      ref={calendarRef}
      customInput={
        selectsRange ? (
          <DatepickerCustomRangeInput
            startDate={startDateProp}
            endDate={endDateProp}
            dateFormat={dateFormat}
          />
        ) : (
          <DatepickerCustomInput />
        )
      }
      dateFormat={dateFormat}
      popperClassName="max-w-[20.5rem] !z-[1000]"
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
      selectsRange={selectsRange}
      onChange={handleChange}
      selected={selectsRange ? undefined : startDate}
      startDate={selectsRange ? startDate : undefined}
      endDate={selectsRange ? endDate : undefined}
      onClickOutside={resetValues}
      {...rest}
    >
      <div className="p-4 border-t border-t-gray-200 w-full flex items-center justify-between gap-2">
        <Button
          {...cancelButtonProps}
          mode={cancelButtonMode || ('primaryOutline' as ButtonMode)}
          onClick={(e) => {
            resetValues();
            calendarRef.current?.setOpen(false);
            cancelButtonOnClick?.(e);
          }}
          text={cancelButtonText || formatText({ id: 'button.cancel' })}
          className="flex-grow"
        />
        <Button
          {...applyButtonProps}
          disabled={
            !startDate ||
            (!endDate && !!selectsRange) ||
            (!!endDate && !!startDate && isAfter(startDate, endDate))
          }
          mode={applyButtonMode || ('primarySolid' as ButtonMode)}
          onClick={(e) => {
            const onChangeArg = (
              selectsRange ? [startDate, endDate] : startDate
            ) as Parameters<typeof onChange>[0];

            onChange(onChangeArg, undefined);
            calendarRef.current?.setOpen(false);
            applyButtonOnClick?.(e);
          }}
          text={applyButtonText || formatText({ id: 'button.apply' })}
          className="flex-grow"
        />
      </div>
    </DatePicker>
  );
};

export default Datepicker;
