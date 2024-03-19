import clsx from 'clsx';
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
import DatepickerCustomInput from './partials/DatepickerCustomInput/index.ts';
import { type DatepickerProps } from './types.ts';

import styles from '../common/Datepicker.module.css';

const Datepicker: FC<DatepickerProps> = ({
  cancelButtonProps,
  applyButtonProps,
  popperModifiers,
  onChange,
  selected: selectedProp,
  dateFormat = DEFAULT_DATE_FORMAT,
  popperClassName,
  minYear,
  maxYear,
  ...rest
}) => {
  const isMobile = useMobile();
  const calendarRef = useRef<DatePicker>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    selectedProp || null,
  );

  const resetValues = () => {
    setSelectedDate(selectedProp || null);
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
          startDate={selectedDate}
          dateFormat={dateFormat}
          setStartDate={setSelectedDate}
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
      customInput={<DatepickerCustomInput />}
      dateFormat={dateFormat}
      popperClassName={clsx(popperClassName, '!z-[1000] max-w-[20.5rem]')}
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
      onChange={(date) => setSelectedDate(date)}
      selected={selectedProp}
      onClickOutside={resetValues}
      {...rest}
    >
      {selectedDate && (
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
            mode={applyButtonMode || ('primarySolid' as ButtonMode)}
            onClick={(event) => {
              onChange(selectedDate, undefined);
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

export default Datepicker;
