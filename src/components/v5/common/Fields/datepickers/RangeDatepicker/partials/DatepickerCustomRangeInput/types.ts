import { type InputBaseProps } from '~v5/common/Fields/InputBase/types.ts';

export interface DatepickerCustomRangeInputProps
  extends Pick<InputBaseProps, 'onClick' | 'onFocus' | 'disabled'> {
  dateFormat: string;
  startDate?: Date | null;
  endDate?: Date | null;
}
