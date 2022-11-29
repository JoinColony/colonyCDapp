import React, { useCallback, useState, useLayoutEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import MaskedAddress from '~shared/MaskedAddress';
import { MiniSpinnerLoader } from '~shared/Preloaders';
import Button from '~shared/Button';
import { GasStationPopover, GasStationProvider } from '~frame/GasStation';
import {
  readyTransactionsCount,
  TransactionOrMessageGroups,
} from '~frame/GasStation/transactionGroup';

import { ActionTypes } from '~redux';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import { useAppContext, useAsyncFunction } from '~hooks';
import { getLastWallet } from '~utils/autoLogin';

import styles from './Wallet.css';
import queries from '~styles/queries.css';

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

const { query700: query } = queries;

const Wallet = () => {
  const [walletConnecting, setWalletConnecting] = useState<boolean>(false);
  const { wallet, updateWallet } = useAppContext();
  const isMobile = useMediaQuery({ query });

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

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  const readyTransactions = useMemo(
    // @ts-ignore
    () => readyTransactionsCount(transactionAndMessageGroups),
    [transactionAndMessageGroups],
  );

  useLayoutEffect(() => {
    if (!wallet && getLastWallet()) {
      handleConnectWallet();
    }
  }, [handleConnectWallet, wallet]);

  return (
    <>
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
      <span>
        {isMobile ? (
          // Render GasStationPopover outside of div.elementWrapper on mobile
          // Popover will not be accessible from a button like on Desktop. It will appear when completing an action.
          wallet?.address && (
            <GasStationProvider>
              <GasStationPopover
                transactionAndMessageGroups={
                  transactionAndMessageGroups as unknown as TransactionOrMessageGroups
                }
              >
                <div className={styles.gasStationReference} />
              </GasStationPopover>
            </GasStationProvider>
          )
        ) : (
          <div className={styles.main}>
            {wallet?.address && (
              <GasStationProvider>
                <GasStationPopover
                  transactionAndMessageGroups={
                    transactionAndMessageGroups as unknown as TransactionOrMessageGroups
                  }
                >
                  {({ isOpen, toggle, ref }) => (
                    <>
                      <button
                        type="button"
                        className={
                          isOpen
                            ? styles.walletAddressActive
                            : styles.walletAddress
                        }
                        ref={ref}
                        onClick={toggle}
                        data-test="gasStationPopover"
                      >
                        <span>
                          <MaskedAddress address={wallet.address as string} />
                        </span>
                      </button>
                      {readyTransactions >= 1 && (
                        <span className={styles.readyTransactionsCount}>
                          <span>{readyTransactions}</span>
                        </span>
                      )}
                    </>
                  )}
                </GasStationPopover>
              </GasStationProvider>
            )}
          </div>
        )}
      </span>
    </>
  );
};

Wallet.displayName = displayName;

export default Wallet;
