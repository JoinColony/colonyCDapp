import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import UserHub from '~common/Extensions/UserHub';
import {
  useAppContext,
  useColonyContext,
  useDetectClickOutside,
  useMobile,
} from '~hooks';
import Button from '~v5/shared/Button';
import PopoverBase from '~v5/shared/PopoverBase';
import UserAvatar from '~v5/shared/UserAvatar';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import { UserHubButtonProps } from './types';
import { splitWalletAddress } from '~utils/splitWalletAddress';

import styles from './UserHubButton.module.css';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserHubButton';

const UserHubButton: FC<UserHubButtonProps> = ({
  hideMemberReputationOnMobile,
}) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const { profile } = user || {};
  const walletAddress = wallet?.address;
  const [isUserHubOpen, setIsUserHubOpen] = useState(false);

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

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
        delayShow: isMobile ? 0 : 200,
        delayHide: isMobile ? 0 : 200,
        placement: isMobile ? 'bottom' : 'bottom-end',
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
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            user={user}
            userName={
              profile?.displayName ?? splitWalletAddress(walletAddress ?? '')
            }
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
