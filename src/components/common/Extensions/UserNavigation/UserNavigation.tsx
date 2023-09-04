import React, { FC, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import {
  ThirdwebProvider,
  metamaskWallet,
  walletConnect,
  paperWallet,
  ConnectWallet,
} from '@thirdweb-dev/react';

import { useAppContext, useMobile } from '~hooks';
import Button, { Hamburger, PendingButton } from '~v5/shared/Button';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { getLastWallet } from '~utils/autoLogin';
import UserReputation from './partials/UserReputation';
import { UserNavigationProps } from './types';
import { useGetNetworkToken } from '~hooks/useGetNetworkToken';
import {
  TransactionGroupStates,
  useUserTransactionContext,
} from '~context/UserTransactionContext';
import CompletedButton from '~v5/shared/Button/CompletedButton';

export const displayName = 'common.Extensions.UserNavigation';

// @TODO: change name to Wallet
const UserNavigation: FC<UserNavigationProps> = ({
  isWalletButtonVisible,
  userMenuGetTooltipProps,
  userMenuSetTooltipRef,
  userMenuSetTriggerRef,
  setWalletTriggerRef,
  isUserMenuOpen,
  isWalletOpen,
}) => {
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const [isUserNavigationButtonsVisible, setIsUserNavigationButtonsVisible] =
    useState(true);

  const isWalletConnected = !!wallet?.address;
  const nativeToken = useGetNetworkToken();

  if (!isMobile && !isUserNavigationButtonsVisible) {
    setIsUserNavigationButtonsVisible(true);
  }

  useLayoutEffect(() => {
    const isWalletSavedInLocalStorage = getLastWallet();
    if (!wallet && isWalletSavedInLocalStorage) {
      connectWallet?.();
    }
  }, [connectWallet, wallet]);

  const { groupState } = useUserTransactionContext();

  return (
    <div className="flex gap-1">
      <div
        className={clsx('flex gap-1', {
          hidden: !isWalletConnected || !isUserNavigationButtonsVisible,
        })}
      >
        {nativeToken && <Token nativeToken={nativeToken} />}
        <UserReputation />
      </div>
      <ThirdwebProvider
        supportedWallets={[
          metamaskWallet(),
          walletConnect(),
          paperWallet({
            paperClientId: 'bb61f458-f974-4d2c-a097-b9766b11c528',
          }),
        ]}
        clientId="987176e68fbcfc62f5fb92db447a527f"
      >
        <ConnectWallet />
      </ThirdwebProvider>
      {isUserNavigationButtonsVisible && !isWalletConnected && (
        <Button
          mode="tertiary"
          isFullRounded
          setTriggerRef={setWalletTriggerRef}
          onClick={connectWallet}
          iconName={isWalletOpen && isMobile ? 'close' : 'cardholder'}
          size="small"
        >
          {isWalletButtonVisible && formatMessage({ id: 'connectWallet' })}
        </Button>
      )}
      {isWalletButtonVisible && (
        <>
          <Hamburger
            isOpened={isUserMenuOpen && isMobile}
            iconName={isUserMenuOpen && isMobile ? 'close' : 'list'}
            setTriggerRef={userMenuSetTriggerRef}
            onClick={() =>
              isMobile &&
              setIsUserNavigationButtonsVisible((prevState) => !prevState)
            }
          />
          {isUserMenuOpen && (
            <UserMenu
              tooltipProps={userMenuGetTooltipProps}
              setTooltipRef={userMenuSetTooltipRef}
              isWalletConnected={isWalletConnected}
              user={user}
              walletAddress={user?.walletAddress}
              nativeToken={nativeToken}
            />
          )}
        </>
      )}
      {!isMobile && groupState === TransactionGroupStates.SomePending && (
        <PendingButton />
      )}
      {!isMobile && groupState === TransactionGroupStates.AllCompleted && (
        <CompletedButton />
      )}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
