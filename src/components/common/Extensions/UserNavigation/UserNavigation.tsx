import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { useSelector } from 'react-redux';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { getLastWallet } from '~utils/autoLogin';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';
import UserReputation from './partials/UserReputation';
import { UserNavigationProps } from './types';

export const displayName = 'common.Extensions.UserNavigation';

// @TODO: change name to Wallet
const UserNavigation: FC<UserNavigationProps> = ({
  hideColonies,
  isWalletButtonVisible,

  userMenuGetTooltipProps,
  userMenuSetTooltipRef,
  userMenuSetTriggerRef,
  setWalletTriggerRef,
  isUserMenuOpen,
  isWalletOpen,
}) => {
  const { colony } = useColonyContext();
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const [isUserNavigationButtonsVisible, setIsUserNavigationButtonsVisible] =
    useState(true);

  const isWalletConnected = !!wallet?.address;
  const { nativeToken } = colony || {};

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  useEffect(() => {
    if (!isMobile) {
      setIsUserNavigationButtonsVisible(true);
    }
  }, [isMobile]);

  useLayoutEffect(() => {
    if (!wallet && connectWallet && getLastWallet()) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

  return (
    <div className="flex gap-1">
      <div
        className={clsx('flex gap-1', {
          hidden: !isWalletConnected || !isUserNavigationButtonsVisible,
        })}
      >
        {nativeToken && <Token nativeToken={nativeToken} />}
        <UserReputation
          hideColonies={hideColonies}
          transactionAndMessageGroups={
            transactionAndMessageGroups as unknown as TransactionOrMessageGroups
          }
        />
      </div>
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
              hideColonies={hideColonies}
            />
          )}
        </>
      )}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
