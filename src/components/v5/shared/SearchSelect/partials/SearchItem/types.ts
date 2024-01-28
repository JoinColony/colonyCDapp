import { type SearchSelectOption } from '../../types.ts';

export interface SearchItemProps {
  options: SearchSelectOption[];
  onChange?: (value: string | number) => void;
  isLabelVisible?: boolean;
}
