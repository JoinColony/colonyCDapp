import { Permissions } from '../../types.ts';

export const permissions: Permissions[] = [
  {
    key: '1',
    text: 'Architecture',
    type: 'clipboard-text',
  },
  {
    key: '2',
    text: 'Arbitration',
    type: 'scales',
  },
  {
    key: '3',
    text: 'Recovery',
    type: 'clock-counter-clockwise',
  },
  {
    key: '4',
    text: 'Funding',
    type: 'bank',
  },
  {
    key: '4',
    text: 'Buildings',
    type: 'buildings',
  },
];

export const userStatustooltipDetails = [
  {
    key: '1',
    text: 'Architecture',
    description: 'Lorem ipsum',
    name: 'clipboard-text',
    mode: 'dedicated',
  },
  {
    key: '2',
    text: 'Arbitration',
    description: 'Lorem ipsum',
    name: 'scales',
    mode: 'active',
  },
  {
    key: '3',
    text: 'Recovery',
    description: 'Lorem ipsum',
    name: 'clock-counter-clockwise',
    mode: 'new',
  },
  {
    key: '4',
    text: 'Top',
    description:
      'This user is in the top 20% of contributors within this Colony.',
    name: 'crown-simple',
    mode: 'top',
  },
  {
    key: '4',
    text: 'Funding',
    description:
      'This user is currently banned from chatting across the Colony.',
    name: 'bank',
    mode: 'banned',
  },
];
