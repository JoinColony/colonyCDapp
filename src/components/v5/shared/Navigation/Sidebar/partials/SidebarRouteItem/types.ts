import { type Icon } from '@phosphor-icons/react';

import { type TypedMessageDescriptor } from '~types';

export interface SidebarRouteItemProps {
  icon?: Icon;
  translation: TypedMessageDescriptor;
  path: string;
  subItems?: SidebarRouteItemProps[];
  onClick?: () => void;
  isColonyRoute?: boolean;
}
