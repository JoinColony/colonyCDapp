import { defineMessages } from 'react-intl';

import { UserHubTabList, UserHubTabs } from './types';

export const menuMessages = defineMessages({
  balance: {
    id: 'UserSubmenu.balance',
    defaultMessage: 'Balances',
  },
  stakes: {
    id: 'UserSubmenu.stakes',
    defaultMessage: 'Stakes',
  },
  transactions: {
    id: 'UserSubmenu.transactions',
    defaultMessage: 'Transactions',
  },
});

export const tabList: UserHubTabList = [
  {
    id: UserHubTabs.Balance,
    label: menuMessages.balance,
    value: UserHubTabs.Balance,
    icon: 'user',
  },
  {
    id: UserHubTabs.Stakes,
    label: menuMessages.stakes,
    value: UserHubTabs.Stakes,
    icon: 'coin-vertical',
  },
  {
    id: UserHubTabs.Transactions,
    label: menuMessages.transactions,
    value: UserHubTabs.Transactions,
    icon: 'receipt',
  },
];
