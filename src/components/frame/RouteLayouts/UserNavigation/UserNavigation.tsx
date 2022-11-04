import React from 'react'; // useEffect // useMemo,
import { defineMessages, useIntl } from 'react-intl'; // useIntl
// import { useParams } from 'react-router-dom';

// import Icon from '~shared/Icon';
// import MemberReputation from '~shared/MemberReputation';
// import { Tooltip } from '~shared/Popover';

// import UserTokenActivationButton from '~users/UserTokenActivationButton';
import AvatarDropdown from '~frame/AvatarDropdown';

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
  // userReputationTooltip: {
  //   id: `${displayName}.userReputationTooltip`,
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
      {/*
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
        </div>
      */}
      <Wallet />
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
