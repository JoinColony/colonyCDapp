import React, { ReactNode } from 'react';
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
        iconName="cardholder"
        text={MSG.connectWalletButton}
        onClick={connectWallet}
        size="small"
      />
    }
    iconName="plugs"
    subtitle={title}
  >
    {text}
  </CardWithCallout>
);

export default CardConnectWallet;
