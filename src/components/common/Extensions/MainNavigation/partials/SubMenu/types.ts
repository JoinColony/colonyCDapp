import { ExtensionStatusBadgeProps } from '~v5/common/Pills/ExtensionStatusBadge/types';

export interface SubMenuItem {
  label: string;
  href: string;
  description: string;
  status?: ExtensionStatusBadgeProps;
}

export interface SubMenuProps {
  items: SubMenuItem[];
}
