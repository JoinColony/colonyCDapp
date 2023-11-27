import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub';
import {
  useAppContext,
  useColonyContext,
  useDetectClickOutside,
  useMobile,
  useTablet,
} from '~hooks';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import Button from '~v5/shared/Button';
import UserAvatar from '~v5/shared/UserAvatar';
import PopoverBase from '~v5/shared/PopoverBase';
import useNavigationSidebarContext from '~v5/frame/NavigationSidebar/partials/NavigationSidebarContext/hooks';

import { UserHubButtonProps } from './types';
import styles from './UserHubButton.module.css';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC<UserHubButtonProps> = ({
  hideMemberReputationOnMobile,
  hideUserNameOnMobile,
}) => {
  const isTablet = useTablet();
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const walletAddress = wallet?.address;
  const [isUserHubOpen, setIsUserHubOpen] = useState(false);
  const { setOpenItemIndex, mobileMenuToggle } = useNavigationSidebarContext();
  const [, { toggleOff }] = mobileMenuToggle;

  const popperTooltipOffset = isTablet ? [0, 1] : [0, 8];

  const ref = useDetectClickOutside({
    onTriggered: (e) => {
      // This stops the hub closing when clicking the pending button (which is outside)
      if (!(e.target as HTMLElement)?.getAttribute('data-openhubifclicked')) {
        setIsUserHubOpen?.(false);
      }
    },
  });

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isTablet ? 0 : 200,
        delayHide: isTablet ? 0 : 200,
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
              offset: popperTooltipOffset,
            },
          },
        ],
      },
    );

  return (
    <div ref={ref}>
      <Button
        mode="tertiary"
        size="large"
        isFullRounded
        setTriggerRef={setTriggerRef}
        className={clsx({
          '!border-blue-400': (visible || isUserHubOpen) && isTablet,
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
      {(visible || isUserHubOpen) && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames={clsx(styles.popover)}
        >
          <div
            className="w-full sm:w-[42.625rem] pt-4 sm:pt-0"
            ref={setTooltipRef}
          >
            <UserHub isTransactionTabVisible={isUserHubOpen} />
          </div>
        </PopoverBase>
      )}
    </div>
  );
};

UserHubButton.displayName = displayName;

export default UserHubButton;
