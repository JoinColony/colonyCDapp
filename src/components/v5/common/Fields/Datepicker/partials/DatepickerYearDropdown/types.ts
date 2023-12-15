export interface DatepickerYearDropdownProps {
  onYearClick: (year: number) => void;
  selectedYear: number;
  selectedMonth: string;
  years: number[];
  className?: string;
}
