import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import MemberReputation from '~shared/MemberReputation';
import { Tooltip } from '~shared/Popover';
import { AvatarDropdown } from '~frame/AvatarDropdown';
import UserTokenActivationButton from '~frame/UserTokenActivationButton';
import HamburgerDropdown from '~frame/HamburgerDropdown';
import {
  useAppContext,
  useColonyContext,
  useUserReputation,
  useMobile,
  useCanInteractWithNetwork,
} from '~hooks';
import { useGetUserTokenBalanceQuery } from '~gql';

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
  const canInteractWithNetwork = useCanInteractWithNetwork();

  const { colonyAddress, nativeToken } = colony || {};

  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        colonyAddress: colonyAddress ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
      },
    },
    skip: !wallet?.address || !colonyAddress || !nativeToken?.tokenAddress,
  });
  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

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
        {canInteractWithNetwork && colony?.nativeToken && tokenBalanceData && (
          <UserTokenActivationButton
            nativeToken={colony.nativeToken}
            tokenBalanceData={tokenBalanceData}
            dataTest="tokenActivationButton"
          />
        )}
      </div>

      <Wallet />
      {tokenBalanceData && (
        <AvatarDropdown
          spinnerMsg={MSG.walletAutologin}
          tokenBalanceData={tokenBalanceData}
        />
      )}
      <HamburgerDropdown />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
