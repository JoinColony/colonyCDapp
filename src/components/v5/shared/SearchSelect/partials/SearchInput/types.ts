import { InputBaseProps } from '~v5/common/Fields/InputBase/types.ts';

export interface SearchInputProps extends Omit<InputBaseProps, 'onChange'> {
  onChange?: (value: string) => void;
  shouldFocus?: boolean;
}
