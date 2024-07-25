import { Cardholder, GearSix, List, X } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useTablet } from '~hooks/index.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import useGetCurrentNetwork from '~hooks/useGetCurrentNetwork.ts';
import { formatText } from '~utils/intl.ts';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks.ts';
import Button, { Hamburger } from '~v5/shared/Button/index.ts';

import NetworkName from './partials/NetworkName/index.ts';
import UserMenu from './partials/UserMenu/index.ts';
import { type UserNavigationProps } from './types.ts';

const displayName = 'common.Extensions.UserNavigation';

const MSG = defineMessages({
  wrongNetwork: {
    id: `${displayName}.unlockedToken`,
    defaultMessage: `Please switch your wallet to the {correctNetworkName} network. More chains will be supported in future.`,
  },
});

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
  const networkInfo = useGetCurrentNetwork();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isTablet ? 0 : 200,
        delayHide: 0,
        placement: isTablet ? 'bottom' : 'bottom-end',
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
              offset: isTablet ? [0, 0] : [0, 8],
            },
          },
        ],
      },
    );

  useDisableBodyScroll(visible && isTablet);

  return (
    <div className="flex gap-1 md:relative">
      {txButtons}
      {isWalletConnected ? (
        <div className="flex gap-1">
          {networkInfo && (
            <NetworkName
              size={isTablet ? 18 : 16}
              networkInfo={networkInfo}
              error={networkInfo?.chainId !== DEFAULT_NETWORK_INFO.chainId}
              errorMessage={formatText(MSG.wrongNetwork, {
                correctNetworkName: DEFAULT_NETWORK_INFO.name,
              })}
            />
          )}
          {userHub}
        </div>
      ) : (
        <Button
          mode="tertiary"
          isFullRounded
          onClick={connectWallet}
          icon={visible && isTablet ? X : Cardholder}
          size="small"
        >
          {formatText({ id: 'connectWallet' })}
        </Button>
      )}
      <Hamburger
        isOpened={visible}
        icon={isTablet ? GearSix : List}
        iconSize={isTablet ? 18 : 16}
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
        />
      )}
      {extra}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
