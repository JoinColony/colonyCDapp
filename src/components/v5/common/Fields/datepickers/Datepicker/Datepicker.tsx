import clsx from 'clsx';
import React, { type FC, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import { type InputBaseProps } from '~v5/common/Fields/InputBase/types.ts';
import Button from '~v5/shared/Button/index.ts';
import { type ButtonMode } from '~v5/shared/Button/types.ts';

import { DATEPICKER_PORTAL_ID, DEFAULT_DATE_FORMAT } from '../common/consts.ts';
import DatepickerContainer from '../common/DatepickerContainer/index.ts';

import DatepickerCustomHeader from './partials/DatepickerCustomHeader/index.ts';
import DatepickerCustomInput from './partials/DatepickerCustomInput/index.ts';
import { type DatepickerProps } from './types.ts';

import styles from '../common/Datepicker.module.css';

const Datepicker: FC<DatepickerProps & { inputProps?: InputBaseProps }> = ({
  cancelButtonProps,
  applyButtonProps,
  popperModifiers,
  onChange,
  selected: selectedProp,
  dateFormat = DEFAULT_DATE_FORMAT,
  popperClassName,
  minYear,
  maxYear,
  inputProps,
  shouldCloseOnSelect = false,
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
      calendarClassName={clsx(styles.wrapper, styles['wrapper--simple'])}
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
      customInput={<DatepickerCustomInput {...inputProps} />}
      dateFormat={dateFormat}
      popperClassName={clsx(popperClassName, '!z-top max-w-[20.5rem]')}
      renderDayContents={(day) => (
        <div className="react-datepicker__day-content">{day}</div>
      )}
      shouldCloseOnSelect={shouldCloseOnSelect}
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
      onChange={(date) => {
        setSelectedDate(date);
        if (shouldCloseOnSelect) {
          onChange(date, undefined);
        }
      }}
      selected={selectedProp}
      onClickOutside={resetValues}
      {...rest}
    >
      {selectedDate && !shouldCloseOnSelect && (
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
