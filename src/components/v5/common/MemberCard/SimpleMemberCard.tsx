import React, { type FC } from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import UserAvatar from '~v5/shared/UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import { type SimpleMemberCardProps } from './types.ts';

const displayName = 'v5.common.SimpleMemberCard';

const SimpleMemberCard: FC<SimpleMemberCardProps> = ({
  user,
  userAddress,
  meatBallMenuProps,
}) => {
  const userName = user?.profile?.displayName || userAddress;

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="flex w-full items-center justify-between gap-4">
        <UserInfoPopover
          walletAddress={userAddress}
          user={user}
          popperOptions={{
            placement: 'bottom-start',
          }}
          className="flex flex-grow items-center text-gray-900"
        >
          <UserAvatar
            userAvatarSrc={user?.profile?.avatar ?? undefined}
            userName={user?.profile?.displayName ?? undefined}
            userAddress={userAddress}
            size={30}
          />
          <p className="ml-2 flex max-w-full items-center justify-center text-center text-1">
            <span className="inline-block w-full truncate">{userName}</span>
          </p>
        </UserInfoPopover>
        <div className="flex-shrink-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
    </div>
  );
};

SimpleMemberCard.displayName = displayName;

export default SimpleMemberCard;
