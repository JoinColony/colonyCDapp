import { SearchSelectOption } from '../../types';

export interface SearchItemProps {
  options: SearchSelectOption[];
  onChange?: (value?: string | null) => void;
  isLabelVisible?: boolean;
}
