import React, { FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useAppContext, useGetNetworkToken, useMobile } from '~hooks';
import { formatText } from '~utils/intl';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';
import Button, { Hamburger } from '~v5/shared/Button';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';

import Token from './partials/Token';
import UserMenu from './partials/UserMenu';
import { UserNavigationProps } from './types';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC<UserNavigationProps> = ({
  extra = null,
  userHub,
  txButtons = null,
}) => {
  const { wallet, connectWallet } = useAppContext();
  const isMobile = useMobile();
  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const [, { toggleOff }] = mobileMenuToggle;

  const isWalletConnected = !!wallet?.address;
  const nativeToken = useGetNetworkToken();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: 0,
        placement: isMobile ? 'bottom' : 'bottom-end',
        trigger: 'click',
        interactive: true,
        onVisibleChange: () => {},
        closeOnOutsideClick: true,
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: isMobile ? [0, 0] : [0, 8],
            },
          },
        ],
      },
    );

  useDisableBodyScroll(visible && isMobile);

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
          iconName={visible && isMobile ? 'close' : 'cardholder'}
          size="small"
        >
          {formatText({ id: 'connectWallet' })}
        </Button>
      )}
      <Hamburger
        isOpened={visible && isMobile}
        iconName={isMobile ? 'gear-six' : 'list'}
        iconSize={isMobile ? 'small' : 'extraTiny'}
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
