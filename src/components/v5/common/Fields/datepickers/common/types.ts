import { type ButtonProps } from '~v5/shared/Button/types.ts';

export interface DatepickerCommonProps {
  cancelButtonProps?: ButtonProps;
  applyButtonProps?: ButtonProps;
  dateFormat?: string;
  minYear?: number;
  maxYear?: number;
}
