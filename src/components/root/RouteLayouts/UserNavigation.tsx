import React, { useCallback, useState, useRef, useLayoutEffect } from 'react'; // useEffect // useMemo,
import { defineMessages } from 'react-intl'; // useIntl
// import { useParams } from 'react-router-dom';

// import Icon from '~shared/Icon';
import MaskedAddress from '~shared/MaskedAddress';
// import MemberReputation from '~shared/MemberReputation';
import { MiniSpinnerLoader } from '~shared/Preloaders';
// import { Tooltip } from '~shared/Popover';

// import { GasStationPopover, GasStationProvider } from '~users/GasStation';
// import UserTokenActivationButton from '~users/UserTokenActivationButton';
// import { readyTransactionsCount } from '~users/GasStation/transactionGroup';
import AvatarDropdown from '~root/AvatarDropdown';
import { ActionButton } from '~shared/Button';
// import InboxPopover from '~users/Inbox/InboxPopover';
// import { ConnectWalletPopover } from '~users/ConnectWalletWizard';

// import {
//   useUserNotificationsQuery,
//   useLoggedInUser,
//   useUserBalanceWithLockQuery,
//   useColonyFromNameQuery,
//   Colony,
// } from '~data/index';
// import { useAutoLogin, getLastWallet } from '~utils/autoLogin';
// import { checkIfNetworkIsAllowed } from '~utils/networks';
import { SUPPORTED_NETWORKS } from '~constants';
import { ActionTypes } from '~redux';
import { useAppContext } from '~hooks';

import { getLastWallet } from '~utils/autoLogin';

// import { groupedTransactionsAndMessages } from '~redux/selectors';

import styles from './UserNavigation.css';

const MSG = defineMessages({
  inboxTitle: {
    id: 'pages.NavigationWrapper.UserNavigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
  connectWallet: {
    id: 'pages.NavigationWrapper.UserNavigation.connectWallet',
    defaultMessage: 'Connect Wallet',
  },
  wrongNetworkAlert: {
    id: 'pages.NavigationWrapper.UserNavigation.wrongNetworkAlert',
    defaultMessage: 'Connected to wrong network',
  },
  walletAutologin: {
    id: 'pages.NavigationWrapper.UserNavigation.walletAutologin',
    defaultMessage: 'Connecting wallet...',
  },
  userReputationTooltip: {
    id: 'pages.NavigationWrapper.UserNavigation.userReputationTooltip',
    defaultMessage: 'This is your share of the reputation in this colony',
  },
});

const displayName = 'pages.NavigationWrapper.UserNavigation';

const UserNavigation = () => {
  const [walletConnecting, setWalletConnecting] = useState<boolean>(false);
  const { wallet, updateWallet } = useAppContext();
  const connectWalletButton = useRef<HTMLElement | null>(null);
  const connectWalletButtonWrapper = useRef<HTMLDivElement | null>(null);

  const handleWalletConnected = useCallback(() => {
    if (updateWallet) {
      updateWallet();
    }
    setWalletConnecting(false);
  }, [updateWallet]);

  const handleConnectWallet = useCallback(() => setWalletConnecting(true), []);

  const setActionButtonRef = useCallback((ref) => {
    connectWalletButton.current = ref;
  }, []);

  useLayoutEffect(() => {
    if (!wallet && getLastWallet()) {
      if (connectWalletButtonWrapper.current) {
        connectWalletButtonWrapper.current.click();
      }
      if (connectWalletButton.current) {
        connectWalletButton.current.click();
      }
    }
  }, [wallet]);

  // const { walletAddress, ethereal, networkId } = useLoggedInUser();
  const networkId = 1;
  // const { colonyName } = useParams<{src/redux
  // const transactionAndMessageGroups = useSelector(
  //   groupedTransactionsAndMessages,
  // );

  // const readyTransactions = useMemo(
  //   () => readyTransactionsCount(transactionAndMessageGroups),
  //   [transactionAndMessageGroups],
  // );

  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const isNetworkAllowed = true;
  // const userCanNavigate = !ethereal && isNetworkAllowed;
  const userCanNavigate = true;

  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;

  // const { formatMessage } = useIntl();

  // useEffect(() => {
  //   if (!userDataLoading && !ethereal) {
  //     dispatch({ type: 'USER_CONNECTED', payload: { isUserConnected: true } });
  //   }
  // }, [userDataLoading, userLock, dispatch, ethereal]);

  return (
    <div className={styles.main}>
      {userCanNavigate && (
        <div
          className={`${styles.elementWrapper} ${styles.networkInfo}`}
          title={
            isNetworkAllowed
              ? SUPPORTED_NETWORKS[networkId || 1]?.name
              : undefined
          }
        >
          {isNetworkAllowed && SUPPORTED_NETWORKS[networkId || 1]?.shortName}
        </div>
      )}
      {/* {!ethereal && !isNetworkAllowed && (
        <div className={`${styles.elementWrapper} ${styles.wrongNetwork}`}>
          <FormattedMessage {...MSG.wrongNetworkAlert} />
        </div>
      )} */}
      {/* {userCanNavigate && colonyData?.colonyAddress && (
        <Tooltip
          content={formatMessage(MSG.userReputationTooltip)}
          placement="bottom-start"
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ],
          }}
        >
          <div className={`${styles.elementWrapper} ${styles.reputation}`}>
            <MemberReputation
              walletAddress={walletAddress}
              colonyAddress={colonyData?.colonyAddress}
              showIconTitle={false}
            />
          </div>
        </Tooltip>
      )} */}
      {/* {ethereal && (
        <ConnectWalletPopover>
          {({ isOpen, toggle, ref }) => (
            <button
              type="button"
              className={
                isOpen
                  ? styles.connectWalletButtonActive
                  : styles.connectWalletButton
              }
              ref={ref}
              onClick={toggle}
            >
              <FormattedMessage {...MSG.connectWallet} />
            </button>
          )}
        </ConnectWalletPopover>
      )} */}
      {wallet?.address && (
        <button
          type="button"
          className={styles.walletAddressTemp}
          // ref={ref}
          // onClick={toggle}
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
        <div
          onClick={handleConnectWallet}
          aria-hidden="true"
          ref={connectWalletButtonWrapper}
        >
          <ActionButton
            innerRef={setActionButtonRef}
            className={
              walletConnecting
                ? styles.connectWalletButtonLoading
                : styles.connectWalletButton
            }
            text={MSG.connectWallet}
            submit={ActionTypes.WALLET_OPEN}
            error={ActionTypes.WALLET_OPEN_ERROR}
            success={ActionTypes.WALLET_OPEN_SUCCESS}
            onSuccess={handleWalletConnected}
          />
        </div>
      )}
      {/* {previousWalletConnected && attemptingAutoLogin && userDataLoading ? (
        <div className={styles.walletAutoLogin}>
          <MiniSpinnerLoader title={MSG.walletAutologin} />
        </div>
      ) : (
        <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
          {userCanNavigate && nativeToken && userLock && (
            <UserTokenActivationButton
              nativeToken={nativeToken}
              userLock={userLock}
              colony={colonyData?.processedColony}
              walletAddress={walletAddress}
              dataTest="tokenActivationButton"
            />
          )}
          {userCanNavigate && (
            <GasStationProvider>
              <GasStationPopover
                transactionAndMessageGroups={transactionAndMessageGroups}
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
                        <MaskedAddress address={walletAddress} />
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
      {userCanNavigate && (
        <InboxPopover notifications={notifications}>
          {({ isOpen, toggle, ref }) => (
            <button
              type="button"
              className={styles.notificationsButton}
              ref={ref}
              onClick={toggle}
            >
              <div
                className={`${styles.notificationsIcon} ${
                  isOpen ? styles.notificationsIconActive : ''
                }`}
              >
                <Icon name="envelope" title={MSG.inboxTitle} />
                {hasUnreadNotifications && (
                  <span className={styles.notificationsHighlight} />
                )}
              </div>
            </button>
          )}
        </InboxPopover>
      )} */}
      {/* <AvatarDropdown
        preventTransactions={!isNetworkAllowed}
        colony={colonyData?.processedColony as Colony}
      /> */}
      <AvatarDropdown preventTransactions={false} colony={{}} />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
