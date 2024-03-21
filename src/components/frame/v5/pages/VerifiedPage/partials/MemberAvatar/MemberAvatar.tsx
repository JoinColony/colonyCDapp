import React, { type FC } from 'react';

import UserPopover from '~v5/shared/UserPopover/index.ts';

import { type MemberAvatarProps } from './types.ts';

const displayName = 'v5.pages.VerifiedPage.partials.MemberAvatar';

const MemberAvatar: FC<MemberAvatarProps> = ({ member }) => {
  const { user } = member || {};
  const { walletAddress = '' } = user || {};

  return (
    <div className="ml-1 flex text-gray-900">
      <UserPopover
        walletAddress={walletAddress}
        popperOptions={{ placement: 'bottom-start' }}
      />
    </div>
  );
};

MemberAvatar.displayName = displayName;

export default MemberAvatar;
