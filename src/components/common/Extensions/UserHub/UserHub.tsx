import React, { FC } from 'react';
import clsx from 'clsx';
import { usePopperTooltip } from 'react-popper-tooltip';
import { AnimatePresence } from 'framer-motion';

import { useAppContext, useColonyContext, useTablet } from '~hooks';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import Button from '~v5/shared/Button';
import UserAvatar from '~v5/shared/UserAvatar';
import PopoverBase from '~v5/shared/PopoverBase';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';

import UserHubContent from './partials/UserHubContent';
import { UserHubProps } from './types';

export const displayName = 'common.Extensions.UserNavigation.partials.UserHub';

const UserHub: FC<UserHubProps> = ({
  hideMemberReputationOnMobile,
  hideUserNameOnMobile,
}) => {
  const isTablet = useTablet();
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
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

  const { profile } = user || {};
  const walletAddress = wallet?.address;
  const [, { toggleOff }] = mobileMenuToggle;

  return (
    <div>
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        ref={setTriggerRef}
        className={clsx({
          '!border-blue-400': visible && isTablet,
        })}
        onClick={() => {
          setOpenItemIndex(undefined);
          toggleOff();
        }}
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            user={user}
            userName={
              profile?.displayName ?? splitWalletAddress(walletAddress ?? '')
            }
            hideUserNameOnMobile={hideUserNameOnMobile}
            size="xxs"
          />
          {walletAddress && (
            <MemberReputation
              colonyAddress={colony?.colonyAddress}
              hideOnMobile={hideMemberReputationOnMobile}
              walletAddress={walletAddress}
            />
          )}
        </div>
      </Button>
      <AnimatePresence>
        {visible && (
          <PopoverBase
            setTooltipRef={setTooltipRef}
            tooltipProps={getTooltipProps}
            classNames={clsx(
              'w-full sm:border z-50 shadow-none rounded-none border-0 p-0 sm:border sm:border-gray-200 sm:shadow-default sm:rounded-lg sm:w-[42.625rem]',
              {
                '!top-[calc(var(--top-content-height)-1.5rem)] h-[calc(100dvh-var(--top-content-height)+1.5rem)] !translate-y-0':
                  isTablet,
              },
            )}
            withMotionAnimation
          >
            <UserHubContent />
          </PopoverBase>
        )}
      </AnimatePresence>
    </div>
  );
};

UserHub.displayName = displayName;

export default UserHub;
