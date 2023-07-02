import React, { FC, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useSelector } from 'react-redux';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { getLastWallet } from '~utils/autoLogin';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';
import UserReputation from './partials/UserReputation';

export const displayName = 'common.Extensions.UserNavigation';

// @TODO: change name to Wallet
const UserNavigation: FC = () => {
  const { colony } = useColonyContext();
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isWalletButtonVisible, setIsWalletButtonVisible] = useState(true);

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayHide: isMobile ? 0 : 200,
        placement: 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: (newVisible) => {
          if (!newVisible && isMobile) {
            setIsButtonVisible(true);
          }
        },
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popperTooltipOffset,
            },
          },
        ],
      },
    );

  const { setTriggerRef: setWalletTriggerRef, visible: isWalletVisible } =
    usePopperTooltip(
      {
        delayHide: isMobile ? 0 : 200,
        placement: 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: (newVisible) => {
          if (!newVisible && isMobile) {
            setIsWalletButtonVisible(true);
          }
        },
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: popperTooltipOffset,
            },
          },
        ],
      },
    );

  const isWalletConnected = !!wallet?.address;
  const { nativeToken } = colony || {};

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  useLayoutEffect(() => {
    if (!wallet && connectWallet && getLastWallet()) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

  return (
    <div className="flex gap-1">
      {isWalletConnected && isButtonVisible && (
        <>
          {nativeToken && <Token nativeToken={nativeToken} />}
          <UserReputation
            transactionAndMessageGroups={
              transactionAndMessageGroups as unknown as TransactionOrMessageGroups
            }
          />
        </>
      )}
      {isButtonVisible && !isWalletConnected && (
        <Button
          mode="tertiary"
          isFullRounded
          setTriggerRef={setWalletTriggerRef}
          onClick={connectWallet}
          iconName={isWalletVisible && isMobile ? 'close' : 'cardholder'}
          size="small"
        >
          {isWalletButtonVisible && formatMessage({ id: 'connectWallet' })}
        </Button>
      )}
      <div>
        {isWalletButtonVisible && (
          <Hamburger
            isOpened={visible && isMobile}
            iconName={visible && isMobile ? 'close' : 'list'}
            setTriggerRef={setTriggerRef}
            onClick={() =>
              isMobile && setIsButtonVisible((prevState) => !prevState)
            }
          />
        )}
        {visible && (
          <div className="w-full h-auto">
            <UserMenu
              tooltipProps={getTooltipProps}
              setTooltipRef={setTooltipRef}
              isWalletConnected={isWalletConnected}
              user={user}
              walletAddress={user?.walletAddress}
              nativeToken={nativeToken}
            />
          </div>
        )}
      </div>
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
