import { type ReactDatePickerProps } from 'react-datepicker';

export type DatepickerCustomTimeInputProps = Pick<
  ReactDatePickerProps<never, false>,
  'selected' | 'onChange'
>;
