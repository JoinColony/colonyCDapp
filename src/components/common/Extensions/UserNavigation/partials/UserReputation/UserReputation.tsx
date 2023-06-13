import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import UserHub from '~common/Extensions/UserHub/UserHub';

import {
  useAppContext,
  useColonyContext,
  useMobile,
  useUserReputation,
} from '~hooks';
import Button from '~shared/Extensions/Button';
import PopoverBase from '~shared/Extensions/PopoverBase/PopoverBase';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from '~shared/MemberReputation/MemberReputation';

export const displayName =
  'common.Extensions.UserNavigation.partials.UserReputation';

const UserReputation: FC = () => {
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const isMobile = useMobile();
  const { profile } = user || {};
  const [, setIsWalletButtonVisible] = useState(true);

  const popperTooltipOffset = !isMobile ? [0, 8] : [0, 0];

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: 200,
        placement: 'bottom-end',
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
    <>
      <Button
        mode="tertiaryOutline"
        isFullRounded
        setTriggerRef={setTriggerRef}
        // onClick={() => isMobile && setIsButtonVisible((prevState) => !prevState)}
      >
        <div className="flex items-center gap-3">
          <UserAvatar
            user={user}
            userName={profile?.displayName || user?.name || ''}
            size="xxs"
          />
          <MemberReputation
            userReputation={userReputation}
            totalReputation={totalReputation}
          />
        </div>
      </Button>
      <PopoverBase
        setTooltipRef={setTooltipRef}
        tooltipProps={getTooltipProps}
        classNames={clsx({
          'w-full border-none shadow-none': isMobile,
          'w-[20.125rem]': !isMobile,
        })}
      >
        <div ref={setTooltipRef}>{visible && <UserHub />}</div>
      </PopoverBase>
    </>
  );
};

UserReputation.displayName = displayName;

export default UserReputation;
