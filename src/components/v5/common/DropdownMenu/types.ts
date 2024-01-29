import { type DropdownMenuItemProps } from './partials/DropdownMenuItem/types.ts';

export type DropdownMenuItem = DropdownMenuItemProps & {
  key: string;
};

export interface DropdownMenuGroup {
  key: string;
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  groups: DropdownMenuGroup[];
  className?: string;
  showSubMenuInPopover?: boolean;
}
