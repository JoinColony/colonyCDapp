import { type Icon } from '@phosphor-icons/react';

import { type TypedMessageDescriptor } from '~utils/intl.ts';

type RouteSectionItemBaseProps = {
  id: string;
  icon?: Icon;
  routeType?: 'colony' | 'account';
  translation: TypedMessageDescriptor;
};

export type RouteSectionItemProps = RouteSectionItemBaseProps &
  (
    | {
        path: string;
        subItems?: never;
      }
    | { subItems: RouteSectionItemProps[]; path?: never }
  );
