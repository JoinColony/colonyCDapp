import { SealCheck } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';

import { UserAvatar2 } from '../UserAvatar/UserAvatar.tsx';
import UserStatusWrapper from '../UserStatusWrapper/UserStatusWrapper.tsx';

import { type UserDetailsProps } from './types.ts';

const displayName = 'v5.UserDetails';

const UserDetails: FC<UserDetailsProps> = ({
  userName,
  walletAddress,
  userStatus,
  isVerified,
  userAvatarSrc,
  size,
}) => {
  const mode: UserStatusMode =
    (userStatus === 'new' && 'active-new') ||
    (userStatus === 'active' && 'active-filled') ||
    (userStatus === 'dedicated' && 'dedicated-filled') ||
    (userStatus === 'top' && 'top-filled') ||
    'general';

  const getUserAvatarWrapper = () => {
    const userAvatar = (
      <UserAvatar2
        size={size}
        userAvatarSrc={userAvatarSrc}
        userName={userName ?? undefined}
        userAddress={walletAddress}
      />
    );
    if (mode === 'general') {
      return userAvatar;
    }

    return (
      <UserStatusWrapper userStatus={mode}>{userAvatar}</UserStatusWrapper>
    );
  };

  return (
    <div className="grid grid-cols-[auto,1fr] items-center gap-x-4">
      {!!userStatus && userStatus === 'verified' ? (
        <UserAvatar2
          size={size}
          userAvatarSrc={userAvatarSrc}
          userAddress={walletAddress}
        />
      ) : (
        <div className="flex relative justify-center">
          {getUserAvatarWrapper()}
          {!!userStatus && userStatus !== 'general' && (
            <span className="absolute bottom-[-0.9375rem]">
              <UserStatus
                mode={mode}
                text={formatText({ id: userStatus })}
                pillSize="small"
              />
            </span>
          )}
        </div>
      )}
      <div>
        <div className="mb-0.5 grid grid-cols-[auto,1fr] items-center gap-x-2">
          <p className="truncate heading-4">{userName || walletAddress}</p>
          {isVerified && (
            <span className="flex shrink-0 text-blue-400">
              <SealCheck size={14} />
            </span>
          )}
        </div>
        <div className="py-1">
          {walletAddress && <CopyableAddress address={walletAddress} />}
        </div>
      </div>
    </div>
  );
};

UserDetails.displayName = displayName;

export default UserDetails;
