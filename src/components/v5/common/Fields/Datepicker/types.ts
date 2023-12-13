import { ReactDatePickerProps } from 'react-datepicker';

import { ButtonProps } from '~v5/shared/Button/types';

export interface DatepickerProps<T extends boolean = false>
  extends Omit<
    ReactDatePickerProps<never, T>,
    | 'renderCustomHeader'
    | 'calendarContainer'
    | 'calendarClassName'
    | 'dateFormat'
  > {
  cancelButtonProps?: ButtonProps;
  applyButtonProps?: ButtonProps;
  dateFormat?: string;
}
