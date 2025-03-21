import { Cardholder, GearSix, List, UserPlus, X } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';
import { defineMessages } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { TourTargets } from '~common/Tours/enums.ts';
import { DEFAULT_NETWORK_INFO } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useMobile } from '~hooks/index.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import useGetCurrentNetwork from '~hooks/useGetCurrentNetwork.ts';
import { formatText } from '~utils/intl.ts';
import InviteMembersModal from '~v5/common/Modals/InviteMembersModal/index.ts';
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
  invite: {
    id: `${displayName}.invite`,
    defaultMessage: 'Invite',
  },
});

// @TODO: Rename this to something more explanatory
const UserNavigation: FC<UserNavigationProps> = ({
  extra = null,
  userHub,
  txButton = null,
}) => {
  const { wallet, connectWallet, user } = useAppContext();
  const isMobile = useMobile();
  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const [, { toggleOff }] = mobileMenuToggle;
  const { setShowTabletColonyPicker, setShowTabletSidebar } =
    usePageLayoutContext();
  const { actionSidebarToggle } = useActionSidebarContext();
  const [isInviteMembersModalOpen, setIsInviteMembersModalOpen] =
    useState(false);
  const [isActionSidebarOpen] = actionSidebarToggle;

  const colonyContext = useColonyContext({ nullableContext: true });
  const isInColony = !!colonyContext;

  const isWalletConnected = !!wallet?.address;
  const networkInfo = useGetCurrentNetwork();

  const [visible, setVisible] = useState(false);

  const { getTooltipProps, setTooltipRef, setTriggerRef } = usePopperTooltip(
    {
      visible,
      onVisibleChange: setVisible,
      delayShow: isMobile ? 0 : 200,
      delayHide: 0,
      placement: isMobile ? 'bottom' : 'bottom-end',
      trigger: 'click',
      interactive: true,
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

  const onUserMenuButtonClick = () => {
    setOpenItemIndex(undefined);
    toggleOff();
    setShowTabletColonyPicker(false);
    setShowTabletSidebar(false);
  };

  return (
    <div data-tour={TourTargets.UserMenu} className="flex gap-1 md:relative">
      {!isActionSidebarOpen && isWalletConnected && user && isInColony ? (
        <Button
          text={isMobile ? undefined : MSG.invite}
          mode="tertiary"
          icon={UserPlus}
          iconSize={16}
          size="small"
          isFullRounded
          className="gap-1 px-3.5 sm:px-2.5 md:hover:!border-blue-400"
          onClick={() => setIsInviteMembersModalOpen(true)}
        />
      ) : null}
      {txButton}
      {isWalletConnected ? (
        <div className="flex gap-1">
          {networkInfo && (
            <NetworkName
              size={isMobile ? 18 : 16}
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
        onClick={onUserMenuButtonClick}
        data-testid="user-navigation-hamburger"
      />
      {visible && (
        <UserMenu
          tooltipProps={getTooltipProps}
          setTooltipRef={setTooltipRef}
          setVisible={setVisible}
        />
      )}
      {extra}
      {isInColony && (
        <InviteMembersModal
          isOpen={isInviteMembersModalOpen}
          onClose={() => setIsInviteMembersModalOpen(false)}
        />
      )}
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
