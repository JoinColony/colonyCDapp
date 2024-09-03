import {
  CoinVertical,
  Receipt,
  Invoice,
  CreditCard,
  Star,
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
  reputation: {
    id: 'UserSubmenu.reputation',
    defaultMessage: 'Reputation',
  },
  stakes: {
    id: 'UserSubmenu.stakes',
    defaultMessage: 'Stakes',
  },
  transactions: {
    id: 'UserSubmenu.transactions',
    defaultMessage: 'Transactions',
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
    id: UserHubTab.Reputation,
    label: formatText(menuMessages.reputation),
    value: UserHubTab.Reputation,
    icon: Star,
  },
  {
    id: UserHubTab.Stakes,
    label: formatText(menuMessages.stakes),
    value: UserHubTab.Stakes,
    icon: CoinVertical,
  },
  {
    id: UserHubTab.Transactions,
    label: formatText(menuMessages.transactions),
    value: UserHubTab.Transactions,
    icon: Receipt,
  },
  {
    id: UserHubTab.CryptoToFiat,
    label: formatText(menuMessages.cryptoToFiat),
    value: UserHubTab.CryptoToFiat,
    icon: CreditCard,
    featureFlag: FeatureFlag.CRYPTO_TO_FIAT_WITHDRAWALS,
  },
];
