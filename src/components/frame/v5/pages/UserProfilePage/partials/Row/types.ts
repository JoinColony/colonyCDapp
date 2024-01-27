import { RowItemProps } from '../RowItem/types.ts';

export interface RowItem extends RowItemProps {
  key: string;
}
export interface RowGroup
  extends Omit<RowItemProps, 'buttonProps' | 'copyAddressProps'> {
  key: string;
  items?: RowItem[];
}

export interface RowProps {
  groups: RowGroup[];
  className?: string;
}
