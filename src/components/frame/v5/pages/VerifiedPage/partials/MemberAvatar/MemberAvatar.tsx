import React, { FC } from 'react';
import { useContributorBreakdown } from '~hooks';

import { splitWalletAddress } from '~utils/splitWalletAddress';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import { MemberAvatarProps } from './types';

const MemberAvatar: FC<MemberAvatarProps> = ({ member }) => {
  const { user } = member || {};
  const { walletAddress = '', profile } = user || {};
  const { bio, displayName } = profile || {};
  const domains = useContributorBreakdown(member);

  return (
    <div className="ml-1 flex">
      <UserAvatarPopover
        userName={displayName}
        walletAddress={splitWalletAddress(walletAddress || '')}
        aboutDescription={bio || ''}
        domains={domains}
        user={user}
        avatarSize="xs"
        isVerified
      />
    </div>
  );
};

export default MemberAvatar;
