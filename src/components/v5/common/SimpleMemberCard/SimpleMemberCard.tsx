import React, { type FC } from 'react';

import { splitAddress } from '~utils/strings.ts';
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
  const { header, start, end } = splitAddress(userAddress);
  const userName = user?.profile?.displayName || `${header}${start}...${end}`;

  return (
    <div className="flex h-full w-full items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-25 p-5">
      <UserInfoPopover
        walletAddress={userAddress}
        user={user}
        popperOptions={{
          placement: 'bottom-start',
        }}
        className="flex min-w-0 flex-1 flex-grow items-center text-gray-900"
      >
        <UserAvatar
          userAvatarSrc={user?.profile?.avatar ?? undefined}
          userName={user?.profile?.displayName ?? undefined}
          userAddress={userAddress}
          size={30}
        />
        <p className="ml-2 truncate text-start text-1">{userName}</p>
      </UserInfoPopover>
      <div className="flex-shrink-0">
        <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
      </div>
    </div>
  );
};

SimpleMemberCard.displayName = displayName;

export default SimpleMemberCard;
