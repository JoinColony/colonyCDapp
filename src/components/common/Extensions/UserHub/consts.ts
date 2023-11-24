import { UserHubTabList, UserHubTabs } from './types';

export const tabList: UserHubTabList = [
  {
    id: UserHubTabs.Overview,
    label: 'Your overview',
    value: UserHubTabs.Overview,
    icon: 'user',
  },
  {
    id: UserHubTabs.Stakes,
    label: 'Stakes',
    value: UserHubTabs.Stakes,
    icon: 'coin-vertical',
  },
  {
    id: UserHubTabs.Transactions,
    label: 'Transactions',
    value: UserHubTabs.Transactions,
    icon: 'receipt',
  },
];
