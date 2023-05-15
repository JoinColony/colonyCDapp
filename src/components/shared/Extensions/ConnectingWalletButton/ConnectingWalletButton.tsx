import React, { useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';
import { useAppContext } from '~hooks';
import Button from '~shared/Extensions/Button';
import { getLastWallet } from '~utils/autoLogin';

const displayName = 'Extensions.ConnectingWalletButton';

const ConnectingWalletButton = () => {
  const { formatMessage } = useIntl();
  const { wallet, walletConnecting, connectWallet } = useAppContext();

  useLayoutEffect(() => {
    if (!wallet && connectWallet && getLastWallet()) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

  return (
    <>
      {walletConnecting && (
        <Button isPending={walletConnecting} mode="pending" title="pending" onClick={connectWallet}>
          {formatMessage({ id: 'pending' })}
        </Button>
      )}
    </>
  );
};

ConnectingWalletButton.displayName = displayName;

export default ConnectingWalletButton;
