import { type Icon } from '@phosphor-icons/react';

import { type TypedMessageDescriptor } from '~types';

export interface SidebarRouteItemProps {
  id: string;
  icon?: Icon;
  routeType?: 'colony' | 'account';
  translation: TypedMessageDescriptor;
  path: string;
  subItems?: SidebarRouteItemProps[];
  onClick?: () => void;
}
