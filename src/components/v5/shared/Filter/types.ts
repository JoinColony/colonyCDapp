import { type ButtonProps } from '../Button/types.ts';

export interface FilterButtonProps {
  isOpen: boolean;
  numberSelectedFilters?: number;
  setTriggerRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onClick?: () => void;
  customLabel?: string;
  className?: string;
  size?: ButtonProps['size'];
}
