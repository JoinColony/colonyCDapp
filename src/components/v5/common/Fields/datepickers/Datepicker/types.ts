import { type ReactDatePickerProps } from 'react-datepicker';

import { type DatepickerCommonProps } from '../common/types.ts';

export type DatepickerProps = Omit<
  ReactDatePickerProps<never, false>,
  | 'renderCustomHeader'
  | 'calendarContainer'
  | 'calendarClassName'
  | 'dateFormat'
  | 'selectsRange'
  | 'startDate'
  | 'endDate'
> &
  DatepickerCommonProps;
