import {
  type SearchSelectOption,
  type SearchSelectProps,
} from '~v5/shared/SearchSelect/types.ts';

export interface CheckboxSearchItemProps<T>
  extends Pick<SearchSelectProps<T>, 'renderOption'> {
  checkboxesList?: string[];
  options: SearchSelectOption<T>[];
  onChange?: (value: string | number) => void;
  isLabelVisible?: boolean;
}
