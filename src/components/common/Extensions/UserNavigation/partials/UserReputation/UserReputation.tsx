import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

import {
  useAppContext,
  useColonyContext,
  useDetectClickOutside,
  useMobile,
  useUserReputation,
} from '~hooks';

import UserHub from '~common/Extensions/UserHub';
import Button from '~v5/shared/Button';
import PopoverBase from '~v5/shared/PopoverBase';
import UserAvatar from '~v5/shared/UserAvatar';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';
import { UserReputationProps } from './types';
import { useUserTransactionContext } from '~context/UserTransactionContext';

import styles from './UserReputation.module.css';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserReputation';

const UserReputation: FC<UserReputationProps> = ({
  hideMemberReputationOnMobile,
}) => {
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const isMobile = useMobile();
  const { profile } = user || {};
  const [, setIsWalletButtonVisible] = useState(true);
  const { isUserHubOpen, setIsUserHubOpen } = useUserTransactionContext();

  const popperTooltipOffset = isMobile ? [0, 1] : [0, 8];

  const ref = useDetectClickOutside({
    onTriggered: (e) => {
      // This stops the hub closing when clicking the pending button (which is outside)
      // @ts-expect-error
      if (!e.target?.getAttribute?.('data-openhubifclicked')) {
        setIsUserHubOpen?.(false);
      }
    },
  });

  const {
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible: isUserHubVisible,
  } = usePopperTooltip(
    {
      delayShow: isMobile ? 0 : 200,
      delayHide: isMobile ? 0 : 200,
      placement: isMobile ? 'bottom' : 'bottom-end',
      trigger: 'click',
      interactive: true,
      onVisibleChange: (newVisible) => {
        if (!newVisible && isMobile) {
          setIsWalletButtonVisible(true);
        }
      },
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

  const { colonyAddress } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
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
            userName={profile?.displayName || user?.name}
            size="xxs"
          />
          <MemberReputation
            userReputation={userReputation}
            totalReputation={totalReputation}
            hideOnMobile={hideMemberReputationOnMobile}
          />
        </div>
      </Button>
      {(isUserHubVisible || isUserHubOpen) && (
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

UserReputation.displayName = displayName;

export default UserReputation;
