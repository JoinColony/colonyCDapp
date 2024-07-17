import {
  CoinVertical,
  Receipt,
  Invoice,
  CreditCard,
} from '@phosphor-icons/react';
import { defineMessages } from 'react-intl';

import { FeatureFlag } from '~context/FeatureFlagsContext/types.ts';
import { formatText } from '~utils/intl.ts';

import { type UserHubTabList, UserHubTabs } from './types.ts';

export const menuMessages = defineMessages({
  balance: {
    id: 'UserSubmenu.balance',
    defaultMessage: 'Balance',
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
    id: UserHubTabs.Balance,
    label: formatText(menuMessages.balance),
    value: UserHubTabs.Balance,
    icon: Invoice,
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
  {
    id: UserHubTabs.CryptoToFiat,
    label: formatText(menuMessages.cryptoToFiat),
    value: UserHubTabs.CryptoToFiat,
    icon: CreditCard,
    featureFlag: FeatureFlag.CRYPTO_TO_FIAT,
  },
];
