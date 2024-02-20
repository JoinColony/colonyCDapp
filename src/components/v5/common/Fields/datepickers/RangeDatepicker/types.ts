import { type ReactDatePickerProps } from 'react-datepicker';

import { type DatepickerCommonProps } from '../common/types.ts';

export type RangeDatepickerProps = Omit<
  ReactDatePickerProps<never, true>,
  | 'renderCustomHeader'
  | 'calendarContainer'
  | 'calendarClassName'
  | 'dateFormat'
  | 'selectsRange'
> &
  DatepickerCommonProps;
