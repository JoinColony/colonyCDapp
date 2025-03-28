import { type ReactDatePickerProps } from 'react-datepicker';

import { type DatepickerCommonProps } from '../common/types.ts';

export interface DatepickerWithTimeProps
  extends Omit<
      ReactDatePickerProps<never, false>,
      | 'renderCustomHeader'
      | 'calendarContainer'
      | 'calendarClassName'
      | 'dateFormat'
      | 'selectsRange'
      | 'startDate'
      | 'endDate'
    >,
    DatepickerCommonProps {
  withCloseButton?: boolean;
  onClose?: () => void;
}
