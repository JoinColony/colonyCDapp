import {
  type TokenOption,
  type SearchSelectOption,
} from '~v5/shared/SearchSelect/types.ts';

export interface TokenSelectProps {
  name: string;
  disabled?: boolean;
  readOnly?: boolean;
  filterOptionsFn?: (option: SearchSelectOption<TokenOption>) => boolean;
}
