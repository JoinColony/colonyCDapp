import React, { useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '~hooks';
import { getLastWallet } from '~utils/autoLogin';
import PendingButton from '~v5/shared/Button/PendingButton';

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
        <PendingButton
          isPending={walletConnecting}
          title="pending"
          onClick={connectWallet}
        >
          {formatMessage({ id: 'pending' })}
        </PendingButton>
      )}
    </>
  );
};

ConnectingWalletButton.displayName = displayName;

export default ConnectingWalletButton;
