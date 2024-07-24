import React, { type FC } from 'react';
import DatePicker from 'react-datepicker';

import { useMobile } from '~hooks';

import DatepickerCustomTimeInput from '../DatepickerCustomTimeInput/DatepickerCustomTimeInput.tsx';

import { type DatepickerTimePickerProps } from './types.ts';

import styles from './DatepickerTimePicker.module.css';

const DatepickerTimePicker: FC<DatepickerTimePickerProps> = ({
  selected,
  onChange,
  onBlur,
}) => {
  const isMobile = useMobile();

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption=""
      dateFormat="hh:mm aa"
      popperClassName={styles.wrapper}
      placeholderText="--:--"
      popperModifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, -6],
          },
        },
      ]}
      wrapperClassName="w-full"
      customInput={<DatepickerCustomTimeInput />}
      onBlur={onBlur}
      popperProps={
        isMobile
          ? {
              placement: 'top-start',
            }
          : undefined
      }
    />
  );
};

export default DatepickerTimePicker;
