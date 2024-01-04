import React, { FC } from 'react';

import UserAvatarPopover from '~v5/shared/UserAvatarPopover';
import UserPopoverAdditionalContent from '~v5/shared/UserPopoverAdditionalContent';

import { MemberAvatarProps } from './types';

const displayName = 'v5.pages.VerifiedPage.partials.MemberAvatar';

const MemberAvatar: FC<MemberAvatarProps> = ({ member }) => {
  const { user, isVerified } = member || {};
  const { walletAddress = '' } = user || {};

  return (
    <div className="ml-1 flex text-gray-900">
      <UserAvatarPopover
        walletAddress={walletAddress}
        popperOptions={{ placement: 'bottom-start' }}
        additionalContent={
          !isVerified ? (
            <UserPopoverAdditionalContent
              description={
                walletAddress && (
                  <div className="mt-2 font-semibold break-words text-sm pb-2">
                    {walletAddress}
                  </div>
                )
              }
            />
          ) : undefined
        }
      />
    </div>
  );
};

MemberAvatar.displayName = displayName;

export default MemberAvatar;
