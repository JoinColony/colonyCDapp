import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { useUserTokenBalanceContext } from '~context';
import { AvatarDropdown } from '~frame/AvatarDropdown';
import HamburgerDropdown from '~frame/HamburgerDropdown';
import UserTokenActivationButton from '~frame/UserTokenActivationButton';
import {
  useAppContext,
  useUserReputation,
  useMobile,
  useCanInteractWithNetwork,
  useColonyContext,
} from '~hooks';
import MemberReputation from '~shared/MemberReputation';
import { Tooltip } from '~shared/Popover';

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
  const {
    colony: { colonyAddress, nativeToken },
  } = useColonyContext();
  const { wallet } = useAppContext();
  const { tokenBalanceData } = useUserTokenBalanceContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const canInteractWithNetwork = useCanInteractWithNetwork();

  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  return (
    <div className={styles.main}>
      {wallet && !isMobile && (
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
      {canInteractWithNetwork && tokenBalanceData && (
        <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
          <UserTokenActivationButton
            nativeToken={nativeToken}
            tokenBalanceData={tokenBalanceData}
            dataTest="tokenActivationButton"
          />
        </div>
      )}
      <Wallet />
      <AvatarDropdown
        spinnerMsg={MSG.walletAutologin}
        tokenBalanceData={tokenBalanceData ?? undefined}
      />
      <HamburgerDropdown />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
