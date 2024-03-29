import { SealCheck } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';
import Avatar from '~v5/shared/Avatar/index.ts';
import CopyableAddress from '~v5/shared/CopyableAddress/index.ts';

import { type UserAvatarDetailsProps } from './types.ts';

const displayName = 'v5.UserAvatarDetails';

const UserAvatarDetails: FC<UserAvatarDetailsProps> = ({
  userName,
  walletAddress,
  userStatus,
  isVerified,
  avatar,
  isBordered = false,
  size = 'm',
}) => {
  const mode: UserStatusMode =
    (userStatus === 'new' && 'active-new') ||
    (userStatus === 'active' && 'active-filled') ||
    (userStatus === 'dedicated' && 'dedicated-filled') ||
    (userStatus === 'top' && 'top-filled') ||
    'general';

  return (
    <div className="grid grid-cols-[auto,1fr] items-center gap-x-4">
      {!!userStatus && userStatus === 'verified' ? (
        <Avatar
          size={size}
          title={userName}
          avatar={avatar}
          mode={userStatus}
          seed={walletAddress.toLowerCase()}
        />
      ) : (
        <div className="relative flex justify-center">
          <div
            className={clsx('flex rounded-full', {
              'border-2': isBordered,
              'border-success-400': userStatus === 'new',
              'border-warning-400': userStatus === 'active',
              'border-blue-400': userStatus === 'dedicated',
              'border-purple-400': userStatus === 'top',
            })}
          >
            <Avatar
              size={size}
              title={userName}
              avatar={avatar}
              mode={userStatus ?? 'general'}
              seed={walletAddress.toLowerCase()}
            />
          </div>
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

UserAvatarDetails.displayName = displayName;

export default UserAvatarDetails;
