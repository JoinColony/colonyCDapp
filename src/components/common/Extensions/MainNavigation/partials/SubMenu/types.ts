import { ExtensionStatusBadgeProps } from '~common/Extensions/ExtensionStatusBadge-new/types';

export interface SubMenuItem {
  label: string;
  href: string;
  description: string;
  status?: ExtensionStatusBadgeProps;
}

export interface SubMenuProps {
  items: SubMenuItem[];
}
