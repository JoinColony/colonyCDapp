import { Cardholder, Plugs } from '@phosphor-icons/react';
import React, { type ReactNode } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~v5/shared/Button/index.ts';
import CardWithCallout from '~v5/shared/CardWithCallout/index.ts';

const displayName = 'v5.shared.CardConnectWallet';

const MSG = defineMessages({
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: 'Connect wallet',
  },
});

interface CardConnectWalletProps {
  connectWallet: () => void;
  title: ReactNode;
  text: ReactNode;
}

const CardConnectWallet = ({
  connectWallet,
  title,
  text,
}: CardConnectWalletProps) => (
  <CardWithCallout
    button={
      <Button
        className="w-full md:w-auto"
        mode="quinary"
        icon={Cardholder}
        text={MSG.connectWalletButton}
        onClick={connectWallet}
        size="small"
      />
    }
    icon={Plugs}
    subtitle={title}
  >
    {text}
  </CardWithCallout>
);

export default CardConnectWallet;
