import {
  CoinVertical,
  Receipt,
  Invoice,
  CreditCard,
  Bell,
} from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import { formatText } from '~utils/intl.ts';

import { type UserHubTabList, UserHubTab } from './types.ts';

export const menuMessages = defineMessages({
  balance: {
    id: 'UserSubmenu.balance',
    defaultMessage: 'Balance',
  },
  notifications: {
    id: 'UserSubmenu.notifications',
    defaultMessage: 'Notifications',
  },
  transactions: {
    id: 'UserSubmenu.transactions',
    defaultMessage: 'Transactions',
  },
  stakes: {
    id: 'UserSubmenu.stakes',
    defaultMessage: 'Stakes',
  },
  cryptoToFiat: {
    id: 'UserSubmenu.cryptoToFiat',
    defaultMessage: 'Crypto to fiat',
  },
});

export const tabList: UserHubTabList = [
  {
    id: UserHubTab.Balance,
    label: formatText(menuMessages.balance),
    value: UserHubTab.Balance,
    icon: Invoice,
  },
  {
    id: UserHubTab.Notifications,
    label: formatText(menuMessages.notifications),
    value: UserHubTab.Notifications,
    icon: Bell,
  },
  {
    id: UserHubTab.Transactions,
    label: formatText(menuMessages.transactions),
    value: UserHubTab.Transactions,
    icon: Receipt,
  },
  {
    id: UserHubTab.Stakes,
    label: formatText(menuMessages.stakes),
    value: UserHubTab.Stakes,
    icon: CoinVertical,
  },
  {
    id: UserHubTab.CryptoToFiat,
    label: formatText(menuMessages.cryptoToFiat),
    value: UserHubTab.CryptoToFiat,
    icon: CreditCard,
    featureFlag: FeatureFlag.CRYPTO_TO_FIAT_WITHDRAWALS,
  },
];
