import { StakesTabItem } from './types';

export const tabsItems: StakesTabItem[] = [
  { id: 0, type: 'all', title: 'All' },
  {
    id: 1,
    type: 'finalizable',
    title: 'Finalizable',
    showNotificationNumber: true,
  },
  {
    id: 2,
    type: 'claimable',
    title: 'Claimable',
    showNotificationNumber: true,
  },
];
