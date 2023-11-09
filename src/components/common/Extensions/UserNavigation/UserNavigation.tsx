import React, { FC, useLayoutEffect } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { useIntl } from 'react-intl';

import { useAppContext, useGetNetworkToken, useTablet } from '~hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { getLastWallet } from '~utils/autoLogin';
import { UserNavigationProps } from './types';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC<UserNavigationProps> = ({
  extra = null,
  userHub,
  txButtons = null,
}) => {
  const { wallet, user, connectWallet } = useAppContext();
  const { formatMessage } = useIntl();
  const isTablet = useTablet();
  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const [, { toggleOff }] = mobileMenuToggle;

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
        delayShow: isTablet ? 0 : 200,
        delayHide: 0,
        placement: isTablet ? 'bottom' : 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: () => {},
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: isTablet ? [0, 0] : [0, 8],
            },
          },
        ],
      },
    );

  return (
    <div className="flex gap-1 md:relative">
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
          iconName={visible && isTablet ? 'close' : 'cardholder'}
          size="small"
        >
          {formatMessage({ id: 'connectWallet' })}
        </Button>
      )}
      <Hamburger
        isOpened={visible && isTablet}
        iconName={isTablet ? 'gear-six' : 'list'}
        iconSize={isTablet ? 'small' : 'extraTiny'}
        setTriggerRef={setTriggerRef}
        onClick={() => {
          setOpenItemIndex(undefined);
          toggleOff();
        }}
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
      {!isTablet && txButtons}
      {extra}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
