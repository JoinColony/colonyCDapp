import { Plugs } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { BaseTitleSection } from './BaseTitleSection.tsx';

const displayName =
  'v5.common.Navigation.ColonySwitcher.partials.ConnectWalletSection';

const MSG = defineMessages({
  walletNotConnectedTitle: {
    id: `${displayName}.walletNotConnectedTitle`,
    defaultMessage: 'Connect your wallet',
  },
  walletNotConnectedDescription: {
    id: `${displayName}.walletNotConnectedDescription`,
    defaultMessage: 'In order to see your colonies, connect your wallet.',
  },
});

export const ConnectWalletSection = () => {
  return (
    <BaseTitleSection
      icon={Plugs}
      title={formatText(MSG.walletNotConnectedTitle)}
      description={formatText(MSG.walletNotConnectedDescription)}
    />
  );
};
