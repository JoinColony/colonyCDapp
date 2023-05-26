import React, { FC, useLayoutEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';
import clsx from 'clsx';
import { useAppContext, useColonyContext, useMobile, useUserReputation } from '~hooks';
import Button from '~shared/Extensions/Button';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from './partials/MemberReputation';
import Icon from '~shared/Icon';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { getLastWallet } from '~utils/autoLogin';
import WalletPopover from './partials/WalletPopover/WalletPopover';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC = () => {
  const { colony } = useColonyContext();
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { profile } = user || {};
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [isWalletButtonVisible, setIsWalletButtonVisible] = useState(true);

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip(
    {
      delayShow: 200,
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
  const {
    getTooltipProps: getWalletTooltipProps,
    setTooltipRef: setWalletTooltipRef,
    setTriggerRef: setWalletTriggerRef,
    visible: isWalletVisible,
  } = usePopperTooltip(
    {
      delayShow: 200,
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
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, wallet?.address);

  useLayoutEffect(() => {
    if (!wallet && connectWallet && getLastWallet()) {
      connectWallet();
    }
  }, [connectWallet, wallet]);

  return (
    <div className="flex items-center gap-1">
      {isWalletConnected && isButtonVisible && (
        <>
          {nativeToken && <Token nativeToken={nativeToken} />}
          <Button mode="tertiaryOutline" isFullRounded>
            <div className="flex items-center gap-3">
              <UserAvatar user={user} userName={profile?.displayName || user?.name || ''} size="xxs" />
              <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
            </div>
          </Button>
        </>
      )}
      {isButtonVisible && !isWalletConnected && (
        <Button
          mode="quinary"
          isFullRounded
          setTriggerRef={setWalletTriggerRef}
          onClick={() => isMobile && setIsWalletButtonVisible((prevState) => !prevState)}
          className={clsx('md:border-gray-300 md:hover:border-blue-400', {
            'px-4 py-2.5 border-base-white': isWalletVisible && isMobile,
            'p-0': !isWalletVisible && isMobile,
          })}
        >
          <Icon name={isWalletVisible && isMobile ? 'close' : 'cardholder'} appearance={{ size: 'tiny' }} />
          {isWalletButtonVisible && (
            <p className="text-sm font-medium ml-1">{formatMessage({ id: 'connectWallet' })}</p>
          )}
        </Button>
      )}
      {isWalletVisible && !isWalletConnected && (
        <div className="w-full h-auto absolute top-[6.5rem] md:top-[2.3rem]">
          <WalletPopover setTooltipRef={setWalletTooltipRef} tooltipProps={getWalletTooltipProps} />
        </div>
      )}
      <div>
        {isWalletButtonVisible && (
          <Button
            className={clsx('md:border-gray-300 md:hover:border-blue-400', {
              'px-4 py-2.5 border-base-white': visible && isMobile,
              'p-0': !visible && isMobile,
            })}
            mode="quinary"
            isFullRounded
            setTriggerRef={setTriggerRef}
            onClick={() => isMobile && setIsButtonVisible((prevState) => !prevState)}
          >
            <Icon name={visible && isMobile ? 'close' : 'list'} appearance={{ size: 'tiny' }} />
          </Button>
        )}
        <div className="w-full h-auto absolute top-[6.5rem] md:top-[2.3rem]">
          {visible && (
            <UserMenu
              tooltipProps={getTooltipProps}
              setTooltipRef={setTooltipRef}
              isWalletConnected={isWalletConnected}
              user={user}
              walletAddress={user?.walletAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
