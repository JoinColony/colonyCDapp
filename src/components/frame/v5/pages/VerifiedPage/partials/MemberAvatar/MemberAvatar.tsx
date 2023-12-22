import React, { FC } from 'react';

import UserAvatarPopover from '~v5/shared/UserAvatarPopover';

import { MemberAvatarProps } from './types';

const displayName = 'v5.pages.VerifiedPage.partials.MemberAvatar';

const MemberAvatar: FC<MemberAvatarProps> = ({ member }) => {
  const { user } = member || {};
  const { walletAddress = '' } = user || {};

  return (
    <div className="ml-1 flex text-gray-900">
      <UserAvatarPopover
        walletAddress={walletAddress}
        popperOptions={{ placement: 'bottom-start' }}
      />
    </div>
  );
};

MemberAvatar.displayName = displayName;

export default MemberAvatar;
