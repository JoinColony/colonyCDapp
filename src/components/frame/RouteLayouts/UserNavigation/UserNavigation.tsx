import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import MemberReputation from '~shared/MemberReputation';
import { Tooltip } from '~shared/Popover';
import { AvatarDropdown } from '~frame/AvatarDropdown';
// import UserTokenActivationButton from '~users/UserTokenActivationButton';
// import { useAutoLogin, getLastWallet } from '~utils/autoLogin';
import { useAppContext, useColonyContext, useUserReputation } from '~hooks';

import Wallet from './Wallet';

import styles from './UserNavigation.css';

const displayName = 'frame.RouteLayouts.UserNavigation';

const MSG = defineMessages({
  userReputationTooltip: {
    id: `${displayName}.userReputationTooltip`,
    defaultMessage: 'This is your share of the reputation in this colony',
  },
  walletAutologin: {
    id: 'pages.NavigationWrapper.UserNavigation.walletAutologin',
    defaultMessage: `{isMobile, select,
      true {Connecting...}
      other {Connecting wallet...}
    }`,
  },
});

const UserNavigation = () => {
  const { colony } = useColonyContext();

  const { wallet } = useAppContext();
  const { formatMessage } = useIntl();

  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;

  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress,
    wallet?.address,
  );

  // const { type: lastWalletType, address: lastWalletAddress } = getLastWallet();
  // const attemptingAutoLogin = useAutoLogin();
  // const previousWalletConnected = lastWalletType && lastWalletAddress;

  return (
    <div className={styles.main}>
      {colony?.colonyAddress && wallet && (
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
              userReputation={userReputation}
              totalReputation={totalReputation}
              showIconTitle={false}
            />
          </div>
        </Tooltip>
      )}
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
      <AvatarDropdown
        spinnerMsg={MSG.walletAutologin}
        // appState={
        //   {
        //     previousWalletConnected,
        //     attemptingAutoLogin,
        //     userDataLoading,
        //     userCanNavigate,
        //   }
        // }
      />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
