import { type BaseFieldProps } from '~v5/common/Fields/types.ts';
import {
  type TokenOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface TokenSearchSelectOptionProps {
  key: string;
  title: string;
  options: SearchSelectOption<TokenOption>[];
}

export interface TokenSearchSelectProps extends BaseFieldProps {
  onSelect?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  hideSearchOnMobile?: boolean;
  onSearch?: (value: string) => void;
  readonly?: boolean;
  additionalButtons?: React.ReactNode;
  filterOptionsFn?: (option: SearchSelectOption<TokenOption>) => boolean;
}
