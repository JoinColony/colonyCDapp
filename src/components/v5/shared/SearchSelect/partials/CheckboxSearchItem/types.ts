import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export interface CheckboxSearchItemProps {
  checkboxesList?: string[];
  options: SearchSelectOption[];
  onChange?: (value: string | number) => void;
  isLabelVisible?: boolean;
}
