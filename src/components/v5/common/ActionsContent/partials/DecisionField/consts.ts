import { DecisionMethodProps } from './types';

export const decisionMethodOptions: DecisionMethodProps[] = [
  {
    key: '1',
    label: { id: 'actionSidebar.method.reputation' },
    value: 'reputation',
  },
  {
    key: '2',
    label: { id: 'actionSidebar.method.multisig' },
    value: 'multi-sig-permissions',
  },
  {
    key: '3',
    label: { id: 'actionSidebar.method.permissions' },
    value: 'permissions',
  },
];
