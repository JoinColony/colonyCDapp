import { type ReactDatePickerCustomHeaderProps } from 'react-datepicker';

export interface DatepickerCustomHeaderProps
  extends ReactDatePickerCustomHeaderProps {
  dateFormat: string;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate?: Date | null;
  onClose?: () => void;
  minYear?: number;
  maxYear?: number;
  inline?: boolean;
}
