import React from 'react'; // useEffect // useMemo,
import { defineMessages, useIntl } from 'react-intl'; // useIntl
// import { useParams } from 'react-router-dom';

// import Icon from '~shared/Icon';
// import MemberReputation from '~shared/MemberReputation';
// import { Tooltip } from '~shared/Popover';

// import { GasStationPopover, GasStationProvider } from '~users/GasStation';
// import UserTokenActivationButton from '~users/UserTokenActivationButton';
// import { readyTransactionsCount } from '~users/GasStation/transactionGroup';
import AvatarDropdown from '~frame/AvatarDropdown';
// import { ConnectWalletPopover } from '~users/ConnectWalletWizard';

// import {
//   useUserBalanceWithLockQuery,
// } from '~data/index';
import { SUPPORTED_NETWORKS, DEFAULT_NETWORK_INFO } from '~constants';
import { useAppContext } from '~hooks';

// import { groupedTransactionsAndMessages } from '~redux/selectors';

import Wallet from './Wallet';

import styles from './UserNavigation.css';

const displayName = 'frame.RouteLayouts.UserNavigation';

const MSG = defineMessages({
  // inboxTitle: {
  //   id: 'root.RouteLayouts.UserNavigation.inboxTitle',
  //   defaultMessage: 'Go to your Inbox',
  // },
  // wrongNetworkAlert: {
  //   id: 'root.RouteLayouts.UserNavigation.wrongNetworkAlert',
  //   defaultMessage: 'Connected to wrong network',
  // },
  // userReputationTooltip: {
  //   id: 'root.RouteLayouts.UserNavigation.userReputationTooltip',
  //   defaultMessage: 'This is your share of the reputation in this colony',
  // },
  networkNotSupportedName: {
    id: `${displayName}.networkNotSupportedName`,
    defaultMessage: 'Network not supported by CDapp',
  },
  networkNotSupportedShort: {
    id: `${displayName}.networkNotSupportedName`,
    defaultMessage: 'Not Supported',
  },
});

const UserNavigation = () => {
  const { wallet } = useAppContext();
  const { formatMessage } = useIntl();

  const [{ id: networkId = `0x${DEFAULT_NETWORK_INFO.chainId.toString(16)}` }] =
    wallet?.chains || [{}];
  /*
   * convert from hex to number, remove 0x hex prefix
   */
  const humanReadableId = parseInt(networkId.slice(2), 16);

  // const { colonyName } = useParams<{src/redux
  // const transactionAndMessageGroups = useSelector(
  //   groupedTransactionsAndMessages,
  // );

  // const readyTransactions = useMemo(
  //   () => readyTransactionsCount(transactionAndMessageGroups),
  //   [transactionAndMessageGroups],
  // );

  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;

  return (
    <div className={styles.main}>
      {wallet && (
        <div
          className={`${styles.elementWrapper} ${styles.networkInfo}`}
          title={
            SUPPORTED_NETWORKS[humanReadableId]?.name ||
            formatMessage(MSG.networkNotSupportedName)
          }
        >
          {SUPPORTED_NETWORKS[humanReadableId]?.shortName ||
            formatMessage(MSG.networkNotSupportedShort)}
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
      )} */}
      <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
        <Wallet />
      </div>
      <AvatarDropdown preventTransactions={false} colony={{}} />
      {/* <AvatarDropdown
        preventTransactions={!isNetworkAllowed}
        colony={colonyData?.processedColony as Colony}
      /> */}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
