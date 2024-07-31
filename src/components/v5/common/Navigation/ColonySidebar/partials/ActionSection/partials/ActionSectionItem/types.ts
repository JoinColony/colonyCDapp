import { type Icon } from '@phosphor-icons/react';

import { type Action } from '~constants/actions.ts';
import { type TypedMessageDescriptor } from '~utils/intl.ts';

export interface ActionSectionItemProps {
  Icon: Icon;
  translation: TypedMessageDescriptor;
  action: Action;
}
