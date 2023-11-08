import { InputBaseProps } from '~v5/common/Fields/InputBase/types';

export interface SearchInputProps extends Omit<InputBaseProps, 'onChange'> {
  onChange?: (value: string) => void;
}
