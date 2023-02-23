import React from 'react';
import { BigNumber } from 'ethers';
import { defineMessages, useIntl } from 'react-intl';

import MemberReputation from '~shared/MemberReputation';
import { Tooltip } from '~shared/Popover';
import { AvatarDropdown } from '~frame/AvatarDropdown';
import UserTokenActivationButton from './UserTokenActivationButton';
import HamburgerDropdown from '~frame/HamburgerDropdown';
import {
  useAppContext,
  useColonyContext,
  useUserReputation,
  useMobile,
  useCanInteractWithNetwork,
} from '~hooks';

import Wallet from './Wallet';

import styles from './UserNavigation.css';

const displayName = 'frame.RouteLayouts.UserNavigation';

const MSG = defineMessages({
  userReputationTooltip: {
    id: `${displayName}.userReputationTooltip`,
    defaultMessage: 'This is your share of the reputation in this colony',
  },
  walletAutologin: {
    id: `${displayName}.walletAutologin`,
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
  const isMobile = useMobile();

  // const userLock = userData?.user.userLock;
  // const nativeToken = userLock?.nativeToken;
  const canInteractWithNetwork = useCanInteractWithNetwork();

  const { userReputation, totalReputation } = useUserReputation(
    colony?.colonyAddress,
    wallet?.address,
  );

  const mockedTokenBalanceData = {
    nativeToken: colony?.nativeToken,
    inactiveBalance: BigNumber.from(2),
    lockedBalance: BigNumber.from(2),
    activeBalance: BigNumber.from(2),
    totalBalance: BigNumber.from(2),
    isPendingBalanceZero: false,
  };

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
      <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
        {/* {canInteractWithNetwork && colony?.nativeToken && userLock && ( */}
        {canInteractWithNetwork && colony?.nativeToken && (
          <UserTokenActivationButton
            tokenBalanceData={mockedTokenBalanceData}
            dataTest="tokenActivationButton"
          />
        )}
      </div>

      <Wallet />
      <AvatarDropdown spinnerMsg={MSG.walletAutologin} />
      <HamburgerDropdown />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
