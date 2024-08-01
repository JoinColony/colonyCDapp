import { type Icon } from '@phosphor-icons/react';

import { type TypedMessageDescriptor } from '~utils/intl.ts';

export type RouteSectionItemProps = {
  id: string;
  icon?: Icon;
  routeType?: 'colony' | 'account';
  translation: TypedMessageDescriptor;
  path: string;
  subItems?: RouteSectionItemProps[];
};
