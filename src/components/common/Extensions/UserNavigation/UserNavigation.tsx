import React, { FC, useLayoutEffect } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useIntl } from 'react-intl';

import { useAppContext, useGetNetworkToken, useMobile } from '~hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { getLastWallet } from '~utils/autoLogin';
import { UserNavigationProps } from './types';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC<UserNavigationProps> = ({
  extra = null,
  userHub,
  txButtons = null,
}) => {
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const isWalletConnected = !!wallet?.address;
  const nativeToken = useGetNetworkToken();

  useLayoutEffect(() => {
    const isWalletSavedInLocalStorage = getLastWallet();
    if (!wallet && isWalletSavedInLocalStorage) {
      connectWallet?.();
    }
  }, [connectWallet, wallet]);

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: 0,
        placement: isMobile ? 'bottom' : 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: () => {},
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: isMobile ? [0, -71] : [0, 8],
            },
          },
        ],
      },
    );

  return (
    <div className="flex gap-1">
      {isWalletConnected ? (
        <div className="flex gap-1">
          {nativeToken && <Token nativeToken={nativeToken} />}
          {userHub}
        </div>
      ) : (
        <Button
          mode="tertiary"
          isFullRounded
          onClick={connectWallet}
          iconName={visible && isMobile ? 'close' : 'cardholder'}
          size="small"
        >
          {formatMessage({ id: 'connectWallet' })}
        </Button>
      )}
      <Hamburger
        isOpened={visible && isMobile}
        iconName={visible && isMobile ? 'close' : 'list'}
        setTriggerRef={setTriggerRef}
      />
      {visible && (
        <UserMenu
          tooltipProps={getTooltipProps}
          setTooltipRef={setTooltipRef}
          isWalletConnected={isWalletConnected}
          user={user}
          walletAddress={user?.walletAddress}
          nativeToken={nativeToken}
        />
      )}
      {!isMobile && txButtons}
      {extra}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
