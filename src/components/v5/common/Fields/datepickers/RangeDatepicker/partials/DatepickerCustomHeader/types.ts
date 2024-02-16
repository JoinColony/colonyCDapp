import { type ReactDatePickerCustomHeaderProps } from 'react-datepicker';

export interface DatepickerCustomHeaderProps
  extends ReactDatePickerCustomHeaderProps {
  dateFormat: string;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate?: Date | null;
  endDate?: Date | null;
  onClose?: () => void;
  minYear?: number;
  maxYear?: number;
}
