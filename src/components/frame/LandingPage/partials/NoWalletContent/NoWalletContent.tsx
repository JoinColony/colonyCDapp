import React from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'frame.LandingPage.partials.NoWalletContent';

interface NoWalletContentProps {
  connectWallet: () => void;
}

const MSG = defineMessages({
  connectWalletTitle: {
    id: `${displayName}.connectWalletTitle`,
    defaultMessage: 'Get started',
  },
  connectWalletDescription: {
    id: `${displayName}.connectWalletDescription`,
    defaultMessage:
      'Connect your wallet to sign in and check your access or return to your existing colonies.',
  },
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: 'Connect wallet',
  },
});

const NoWalletContent = ({ connectWallet }: NoWalletContentProps) => (
  <div className="flex w-full flex-col justify-between">
    <div>
      <h1 className="pb-2 heading-2">{formatText(MSG.connectWalletTitle)}</h1>
      <p className="pb-4 text-md font-normal text-gray-600 md:pb-0">
        {formatText(MSG.connectWalletDescription)}
      </p>
    </div>
    <Button isFullSize className="mt-8 hidden md:block" onClick={connectWallet}>
      {formatText(MSG.connectWalletButton)}
    </Button>
  </div>
);

NoWalletContent.displayName = displayName;

export default NoWalletContent;
