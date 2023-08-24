import { SearchSelectOption } from '../../types';

export interface SearchItemProps {
  options: SearchSelectOption[];
  onChange?: (value: string) => void;
  isLabelVisible?: boolean;
}
