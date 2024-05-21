import { CoinVertical, Receipt } from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import Balance from '~images/icons/balance.svg?react';
import { formatText } from '~utils/intl.ts';

import { type UserHubTabList, UserHubTabs } from './types.ts';

export const menuMessages = defineMessages({
  balance: {
    id: 'UserSubmenu.balance',
    defaultMessage: 'Balance',
  },
  stakes: {
    id: 'UserSubmenu.stakes',
    defaultMessage: 'All stakes',
  },
  transactions: {
    id: 'UserSubmenu.transactions',
    defaultMessage: 'All transactions',
  },
});

export const tabList: UserHubTabList = [
  {
    id: UserHubTabs.Balance,
    label: formatText(menuMessages.balance),
    value: UserHubTabs.Balance,
    icon: Balance,
  },
  {
    id: UserHubTabs.Stakes,
    label: formatText(menuMessages.stakes),
    value: UserHubTabs.Stakes,
    icon: CoinVertical,
  },
  {
    id: UserHubTabs.Transactions,
    label: formatText(menuMessages.transactions),
    value: UserHubTabs.Transactions,
    icon: Receipt,
  },
];
