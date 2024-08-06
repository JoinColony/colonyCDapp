import { type Icon } from '@phosphor-icons/react';

import { type Action } from '~constants/actions.ts';
import { type TypedMessageDescriptor } from '~types/index.ts';

export interface ActionSectionItemProps {
  Icon: Icon;
  translation: TypedMessageDescriptor;
  action: Action;
}
