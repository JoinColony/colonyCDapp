import React, { useCallback, useState, useLayoutEffect } from 'react';
import { defineMessages } from 'react-intl';

import MaskedAddress from '~shared/MaskedAddress';
import { MiniSpinnerLoader } from '~shared/Preloaders';
import Button from '~shared/Button';

import { ActionTypes } from '~redux';
import { useAppContext, useAsyncFunction } from '~hooks';
import { getLastWallet } from '~utils/autoLogin';

import styles from './Wallet.css';

const MSG = defineMessages({
  connectWallet: {
    id: 'pages.NavigationWrapper.UserNavigation.connectWallet',
    defaultMessage: 'Connect Wallet',
  },
  walletAutologin: {
    id: 'pages.NavigationWrapper.UserNavigation.walletAutologin',
    defaultMessage: 'Connecting wallet...',
  },
});

const displayName = 'root.RouteLayouts.UserNavigation.Wallet';

const Wallet = () => {
  const [walletConnecting, setWalletConnecting] = useState<boolean>(false);
  const { wallet, updateWallet } = useAppContext();

  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.WALLET_OPEN,
    error: ActionTypes.WALLET_OPEN_ERROR,
    success: ActionTypes.WALLET_OPEN_SUCCESS,
  });

  const handleConnectWallet = useCallback(async () => {
    setWalletConnecting(true);
    let walletConnectSuccess = false;
    try {
      await asyncFunction(undefined);
      walletConnectSuccess = true;
    } catch (error) {
      console.error('Could not connect wallet', error);
    }
    if (updateWallet && walletConnectSuccess) {
      updateWallet();
    }
    setWalletConnecting(false);
  }, [asyncFunction, updateWallet]);

  useLayoutEffect(() => {
    if (!wallet && getLastWallet()) {
      handleConnectWallet();
    }
  }, [handleConnectWallet, wallet]);

  return (
    <>
      {wallet?.address && (
        /*
         * @TODO This will need to be wrapped inside the
         * gas station popover eventually
         */
        <button
          type="button"
          className={styles.walletAddressTemp}
          data-test="gasStationPopover"
        >
          <span>
            <MaskedAddress address={wallet.address as string} />
          </span>
        </button>
      )}
      {walletConnecting && (
        <div className={styles.walletAutoLogin}>
          <MiniSpinnerLoader title={MSG.walletAutologin} />
        </div>
      )}
      {!wallet?.address && (
        <Button
          className={
            walletConnecting
              ? styles.connectWalletButtonLoading
              : styles.connectWalletButton
          }
          text={MSG.connectWallet}
          onClick={handleConnectWallet}
        />
      )}
    </>
  );
};

Wallet.displayName = displayName;

export default Wallet;
