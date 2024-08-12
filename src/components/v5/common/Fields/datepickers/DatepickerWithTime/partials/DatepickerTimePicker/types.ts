import { type ReactDatePickerProps } from 'react-datepicker';

export type DatepickerTimePickerProps = Pick<
  ReactDatePickerProps<never, false>,
  | 'selected'
  | 'onChange'
  | 'onBlur'
  | 'minDate'
  | 'maxDate'
  | 'minTime'
  | 'maxTime'
>;
