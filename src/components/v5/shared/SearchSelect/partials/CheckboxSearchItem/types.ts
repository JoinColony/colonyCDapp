import { type SearchSelectOption } from '../../types.ts';

export interface CheckboxSearchItemProps {
  checkboxesList?: string[];
  options: SearchSelectOption[];
  onChange?: (value: string | number) => void;
  isLabelVisible?: boolean;
}
