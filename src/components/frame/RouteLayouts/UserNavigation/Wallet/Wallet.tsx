import React, { useLayoutEffect, useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import MaskedAddress from '~shared/MaskedAddress';
import { MiniSpinnerLoader } from '~shared/Preloaders';
import Button from '~shared/Button';
import { GasStationPopover, GasStationProvider } from '~frame/GasStation';
import { readyTransactionsCount, TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';

import { groupedTransactionsAndMessages } from '~redux/selectors';
import { useAppContext, useMobile } from '~hooks';
import { getLastWallet } from '~utils/autoLogin';

import styles from './Wallet.css';

const displayName = 'frame.RouteLayouts.UserNavigation.Wallet';

const MSG = defineMessages({
  connectWallet: {
    id: `${displayName}.connectWallet`,
    defaultMessage: 'Connect Wallet',
  },
  walletAutologin: {
    id: `${displayName}.walletAutologin`,
    defaultMessage: 'Connecting wallet...',
  },
});

const Wallet = () => {
  const { wallet, walletConnecting, connectWallet } = useAppContext();
  const isMobile = useMobile();

  const transactionAndMessageGroups = useSelector(groupedTransactionsAndMessages);

  const readyTransactions = useMemo(
    // @ts-ignore
    () => readyTransactionsCount(transactionAndMessageGroups),
    [transactionAndMessageGroups],
  );

  useLayoutEffect(() => {
    if (!wallet && connectWallet && getLastWallet()) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

  return (
    <>
      {walletConnecting && (
        <div className={styles.walletAutoLogin}>
          <MiniSpinnerLoader title={MSG.walletAutologin} />
        </div>
      )}
      {!wallet?.address && (
        <Button
          className={walletConnecting ? styles.connectWalletButtonLoading : styles.connectWalletButton}
          text={MSG.connectWallet}
          onClick={connectWallet}
        />
      )}
      <span>
        {isMobile ? (
          // Render GasStationPopover outside of div.elementWrapper on mobile
          // Popover will not be accessible from a button like on Desktop. It will appear when completing an action.
          wallet?.address && (
            <GasStationProvider>
              <GasStationPopover
                transactionAndMessageGroups={transactionAndMessageGroups as unknown as TransactionOrMessageGroups}
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
                  transactionAndMessageGroups={transactionAndMessageGroups as unknown as TransactionOrMessageGroups}
                >
                  {({ isOpen, toggle, ref }) => (
                    <>
                      <button
                        type="button"
                        className={isOpen ? styles.walletAddressActive : styles.walletAddress}
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
