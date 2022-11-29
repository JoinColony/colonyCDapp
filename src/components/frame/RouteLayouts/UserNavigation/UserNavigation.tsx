import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { defineMessages, useIntl } from 'react-intl';

import MemberReputation from '~shared/MemberReputation';
import { Tooltip } from '~shared/Popover';
import { AvatarDropdown } from '~frame/AvatarDropdown';
// import UserTokenActivationButton from '~users/UserTokenActivationButton';
import {
  useAppContext,
  useColonyContext,
  useUserReputation,
  // useCanInteractWithNetwork,
} from '~hooks';

import Wallet from './Wallet';

import styles from './UserNavigation.css';
import queries from '~styles/queries.css';

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

const { query700: query } = queries;

const UserNavigation = () => {
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery({ query });

  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;
  // const canInteractWithNetwork = useCanInteractWithNetwork();

  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress,
    wallet?.address,
  );

  return (
    <div className={styles.main}>
      {colony?.colonyAddress && wallet && !isMobile && (
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
          {canInteractWithNetwork && nativeToken && userLock && (
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
      <AvatarDropdown spinnerMsg={MSG.walletAutologin} />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
