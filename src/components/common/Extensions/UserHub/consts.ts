import { UserHubTabList, UserHubTabs } from './types';

export const tabList: UserHubTabList = [
  {
    id: UserHubTabs.Overview,
    label: 'Your overview',
    value: 'overview',
    icon: 'user',
  },
  {
    id: UserHubTabs.Stakes,
    label: 'Stakes',
    value: 'stakes',
    icon: 'coin-vertical',
  },
  {
    id: UserHubTabs.Transactions,
    label: 'Transactions',
    value: 'transactions',
    icon: 'receipt',
  },
];
