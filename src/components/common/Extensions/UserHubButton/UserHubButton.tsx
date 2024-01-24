import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import { useAnalyticsContext } from '~context/AnalyticsContext';
import { useAppContext } from '~context/AppContext';
import { useColonyContext } from '~context/ColonyContext';
import { useMobile } from '~hooks';
import useDetectClickOutside from '~hooks/useDetectClickOutside';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';
import Button from '~v5/shared/Button';
import PopoverBase from '~v5/shared/PopoverBase';
import UserAvatar from '~v5/shared/UserAvatar';

import { UserHubTabs } from '../UserHub/types';

import { OPEN_USER_HUB_EVENT } from './consts';
import { UserHubButtonProps } from './types';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC<UserHubButtonProps> = ({
  hideMemberReputationOnMobile,
  hideUserNameOnMobile,
}) => {
  const isMobile = useMobile();
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { wallet, user } = useAppContext();
  const [isUserHubOpen, setIsUserHubOpen] = useState(false);

  const { trackEvent } = useAnalyticsContext();
  const walletAddress = wallet?.address;

  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();

  const [, { toggleOff }] = mobileMenuToggle;

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

  const ref = useDetectClickOutside({
    onTriggered: (e) => {
      // This stops the hub closing when clicking the pending button (which is outside)
      if (!(e.target as HTMLElement)?.getAttribute('data-openhubifclicked')) {
        setIsUserHubOpen(false);
      } else {
        setIsUserHubOpen(true);
      }
    },
  });

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: isMobile ? 0 : 200,
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
              offset: popperTooltipOffset,
            },
          },
        ],
      },
    );

  useDisableBodyScroll(visible && isMobile);

  const handleButtonClick = () => {
    trackEvent(OPEN_USER_HUB_EVENT);
    setOpenItemIndex(undefined);
    toggleOff();
  };

  return (
    <div ref={ref}>
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        ref={setTriggerRef}
        className={clsx(
          {
            '!border-blue-400': visible,
          },
          'md:hover:!border-blue-400',
        )}
        onClick={handleButtonClick}
      >
        <div className="flex items-center gap-2">
          {/* If there's a user, there's a wallet */}
          {walletAddress ? (
            <>
              <UserAvatar
                user={user || walletAddress}
                showUsername={!(hideUserNameOnMobile && isMobile)}
                size="xxs"
              />
              <MemberReputation
                colonyAddress={colonyAddress}
                hideOnMobile={hideMemberReputationOnMobile}
                walletAddress={walletAddress}
              />
            </>
          ) : null}
        </div>
      </Button>
      {(visible || isUserHubOpen) && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames={clsx(
            'w-full p-0 border-none shadow-none sm:border z-50 sm:border-solid sm:border-gray-200 sm:shadow-default sm:rounded-lg sm:w-auto',
            {
              '!translate-y-0 !translate-x-0 !top-[calc(var(--top-content-height)-1.5rem)] h-[calc(100dvh-var(--top-content-height)+1.5rem)]':
                isMobile,
            },
          )}
        >
          <UserHub
            defaultOpenedTab={
              isUserHubOpen ? UserHubTabs.Transactions : undefined
            }
          />
        </PopoverBase>
      )}
    </div>
  );
};

UserHubButton.displayName = displayName;

export default UserHubButton;
