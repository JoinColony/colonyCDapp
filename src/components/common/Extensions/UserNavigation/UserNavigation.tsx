import React, { FC } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useAppContext, useGetNetworkToken, useTablet } from '~hooks';
import { formatText } from '~utils/intl';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';
import Button, { Hamburger } from '~v5/shared/Button';

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
  const isTablet = useTablet();
  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const [, { toggleOff }] = mobileMenuToggle;

  const isWalletConnected = !!wallet?.address;
  const nativeToken = useGetNetworkToken();

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
          {formatText({ id: 'connectWallet' })}
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
