import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl';

import { UserHubTabList, UserHubTabs } from './types';

export const menuMessages = defineMessages({
  balance: {
    id: 'UserSubmenu.balance',
    defaultMessage: 'Your balance',
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
    label: formatText(menuMessages.balance),
    value: UserHubTabs.Balance,
    icon: 'user',
  },
  {
    id: UserHubTabs.Stakes,
    label: formatText(menuMessages.stakes),
    value: UserHubTabs.Stakes,
    icon: 'coin-vertical',
  },
  {
    id: UserHubTabs.Transactions,
    label: formatText(menuMessages.transactions),
    value: UserHubTabs.Transactions,
    icon: 'receipt',
  },
];
