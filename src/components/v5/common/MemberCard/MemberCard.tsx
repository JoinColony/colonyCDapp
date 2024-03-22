import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { AvatarWithStatusBadge } from '~v5/shared/Avatar/index.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import ReputationBadge from '~v5/shared/ReputationBadge/index.ts';
import RolesTooltip from '~v5/shared/RolesTooltip/RolesTooltip.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import { type MemberCardProps } from './types.ts';

const displayName = 'v5.common.MemberCard';

const MemberCard: FC<MemberCardProps> = ({
  userAvatarProps,
  meatBallMenuProps,
  reputation,
  role,
  mode,
  isVerified,
}) => {
  const { user, ...restUserAvatarProps } = userAvatarProps;
  const userName =
    user?.profile?.displayName || restUserAvatarProps.walletAddress;

  return (
    <div className="w-full h-full flex flex-col p-5 rounded-lg border border-gray-200 bg-gray-25">
      <div className="w-full flex items-center relative flex-grow justify-center flex-col">
        <UserInfoPopover
          {...userAvatarProps}
          withVerifiedBadge={false}
          popperOptions={{
            placement: 'bottom-start',
          }}
          className="flex items-center text-gray-900 flex-col justify-between flex-grow gap-2 w-full"
        >
          <AvatarWithStatusBadge
            size="m"
            mode={mode}
            isFilled
            {...restUserAvatarProps}
          />
          <p className="flex items-center justify-center text-center text-1 max-w-full">
            <span className="truncate inline-block w-full">{userName}</span>
            {isVerified && (
              <SealCheck
                size={14}
                className="text-blue-400 ml-1 flex-shrink-0"
              />
            )}
          </p>
        </UserInfoPopover>
        <div className="absolute top-0 right-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
      {(reputation !== undefined || role) && (
        <div className="w-full pt-[.6875rem] mt-[.6875rem] border-t border-t-gray-200 flex items-center justify-between gap-4">
          {reputation !== undefined && (
            <ReputationBadge
              className="min-h-[1.625rem]"
              reputation={reputation}
            />
          )}
          {role && (
            <div className="ml-auto">
              <RolesTooltip role={role} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MemberCard.displayName = displayName;

export default MemberCard;
