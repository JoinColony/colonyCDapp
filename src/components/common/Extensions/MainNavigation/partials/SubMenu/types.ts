import { PillsProps } from '~v5/common/Pills/types';

export interface SubMenuItem {
  label: string;
  href: string;
  description: string;
  status?: PillsProps;
}

export interface SubMenuProps {
  items: SubMenuItem[];
}
