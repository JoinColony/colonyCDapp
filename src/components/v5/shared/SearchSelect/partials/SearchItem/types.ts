import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export interface SearchItemProps {
  options: SearchSelectOption[];
  onChange?: (value: string | number) => void;
  isLabelVisible?: boolean;
}

export interface SearchItemWrapperProps {
  children: React.ReactNode;
  className: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  withoutButton?: boolean;
  name: string | number;
}
