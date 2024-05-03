import { Cardholder, GearSix, List, X } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useMobile } from '~hooks/index.ts';
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
    defaultMessage: `Your wallet is connected to a nework the app was not deployed to yet. ({networkName}).  Please switch your wallet to the "{correctNetworkName}" network.`,
  },
});

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
  const networkInfo = useGetCurrentNetwork();

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
      {txButtons}
      {isWalletConnected ? (
        <div className="flex gap-1">
          {networkInfo && (
            <NetworkName
              size={isMobile ? 18 : 16}
              networkInfo={networkInfo}
              error={networkInfo?.chainId !== DEFAULT_NETWORK_INFO.chainId}
              errorMessage={formatText(MSG.wrongNetwork, {
                networkName: networkInfo?.name,
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
          icon={visible && isMobile ? X : Cardholder}
          size="small"
        >
          {formatText({ id: 'connectWallet' })}
        </Button>
      )}
      <Hamburger
        isOpened={visible}
        icon={isMobile ? GearSix : List}
        iconSize={isMobile ? 18 : 16}
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
