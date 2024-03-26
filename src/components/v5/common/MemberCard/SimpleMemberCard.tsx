import React, { type FC } from 'react';

import MeatBallMenu from '~v5/shared/MeatBallMenu/index.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type SimpleMemberCardProps } from './types.ts';

const displayName = 'v5.common.SimpleMemberCard';

const SimpleMemberCard: FC<SimpleMemberCardProps> = ({
  userAddress,
  meatBallMenuProps,
}) => {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-gray-25 p-5">
      <div className="flex w-full items-center justify-between gap-4">
        <UserPopover
          walletAddress={userAddress}
          size={30}
          popperOptions={{
            placement: 'bottom-start',
          }}
        />
        <div className="flex-shrink-0">
          <MeatBallMenu withVerticalIcon {...meatBallMenuProps} />
        </div>
      </div>
    </div>
  );
};

SimpleMemberCard.displayName = displayName;

export default SimpleMemberCard;
