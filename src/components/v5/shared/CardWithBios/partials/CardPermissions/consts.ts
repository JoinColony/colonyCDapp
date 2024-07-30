import {
  Bank,
  Buildings,
  ClipboardText,
  ClockCounterClockwise,
  Scales,
} from '@phosphor-icons/react';

import { type Permissions } from '~v5/shared/CardWithBios/types.ts';

export const permissions: Permissions[] = [
  {
    key: '1',
    text: 'Architecture',
    icon: ClipboardText,
  },
  {
    key: '2',
    text: 'Arbitration',
    icon: Scales,
  },
  {
    key: '3',
    text: 'Recovery',
    icon: ClockCounterClockwise,
  },
  {
    key: '4',
    text: 'Funding',
    icon: Bank,
  },
  {
    key: '5',
    text: 'Buildings',
    icon: Buildings,
  },
];
