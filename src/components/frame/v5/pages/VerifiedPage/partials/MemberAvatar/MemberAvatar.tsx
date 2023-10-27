import React, { FC } from 'react';
import { useContributorBreakdown } from '~hooks';

import { splitWalletAddress } from '~utils/splitWalletAddress';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import { MemberAvatarProps } from './types';

const displayName = 'v5.pages.VerifiedPage.partials.MemberAvatar';

const MemberAvatar: FC<MemberAvatarProps> = ({ member }) => {
  const { user } = member || {};
  const { walletAddress = '', profile } = user || {};
  const { bio, displayName: userDisplayName } = profile || {};
  const domains = useContributorBreakdown(member);

  return (
    <div className="ml-1 flex">
      <UserAvatarPopover
        userName={userDisplayName}
        walletAddress={splitWalletAddress(walletAddress)}
        aboutDescription={bio || ''}
        domains={domains}
        user={user}
        avatarSize="xs"
        isVerified
      />
    </div>
  );
};

MemberAvatar.displayName = displayName;

export default MemberAvatar;
