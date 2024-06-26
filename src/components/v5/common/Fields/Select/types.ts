import { type Props as ReactSelectProps } from 'react-select';

export interface SelectBaseOption {
  label: string;
  value: string | number;
}

export interface SelectBaseProps<T extends SelectBaseOption>
  extends Omit<ReactSelectProps<T, false>, 'value' | 'defaultValue'> {
  className?: string;
  value?: SelectBaseOption['value'];
  defaultValue?: SelectBaseOption['value'];
  isError?: boolean;
}

export interface SelectOption extends SelectBaseOption {
  to?: string;
}

export type SelectProps = SelectBaseProps<SelectOption>;
