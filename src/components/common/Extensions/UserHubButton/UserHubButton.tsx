import React, { FC } from 'react';
import clsx from 'clsx';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub';
import { useAppContext, useColonyContext, useMobile } from '~hooks';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import Button from '~v5/shared/Button';
import UserAvatar from '~v5/shared/UserAvatar';
import PopoverBase from '~v5/shared/PopoverBase';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';

import { UserHubButtonProps } from './types';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC<UserHubButtonProps> = ({
  hideMemberReputationOnMobile,
  hideUserNameOnMobile,
}) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();

  const walletAddress = wallet?.address;

  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();

  const [, { toggleOff }] = mobileMenuToggle;

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

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

  return (
    <div>
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        ref={setTriggerRef}
        className={clsx({
          '!border-blue-400': visible && isMobile,
        })}
        onClick={() => {
          setOpenItemIndex(undefined);
          toggleOff();
        }}
      >
        <div className="flex items-center gap-3">
          {/* If there's a user, there's a wallet */}
          {walletAddress ? (
            <>
              <UserAvatar
                user={user || walletAddress}
                showUsername={!(hideUserNameOnMobile && isMobile)}
                size="xxs"
              />
              <MemberReputation
                colonyAddress={colony?.colonyAddress}
                hideOnMobile={hideMemberReputationOnMobile}
                walletAddress={walletAddress}
              />
            </>
          ) : null}
        </div>
      </Button>
      {visible && (
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
          <UserHub />
        </PopoverBase>
      )}
    </div>
  );
};

UserHubButton.displayName = displayName;

export default UserHubButton;
