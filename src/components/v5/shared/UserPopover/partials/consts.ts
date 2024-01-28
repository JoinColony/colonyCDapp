import { type ColonyRole } from '@colony/colony-js';

type Subtract<T, U> = T extends U ? never : T;

export const permissionsMap: Record<
  Subtract<`${ColonyRole}`, '4' | '7'>,
  { text: string; description: string; name: string }
> = {
  '0': {
    text: 'Recovery',
    description: 'TODO:  description',
    name: 'clock-counter-clockwise',
  },
  '1': {
    text: 'Root',
    description: 'TODO:  description',
    name: 'app-window',
  },
  '2': {
    text: 'Arbitration',
    description: 'TODO:  description',
    name: 'scales',
  },
  '3': {
    text: 'Architecture',
    description: 'TODO:  description',
    name: 'buildings',
  },
  '5': {
    text: 'Funding',
    description: 'TODO:  description',
    name: 'bank',
  },
  '6': {
    text: 'Administration',
    description: 'TODO:  description',
    name: 'clipboard-text',
  },
};
