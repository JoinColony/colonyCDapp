import clsx from 'clsx';
import React, { FC } from 'react';

import Icon from '~shared/Icon';
import { formatText } from '~utils/intl';
import { UserStatusMode } from '~v5/common/Pills/types';
import UserStatus from '~v5/common/Pills/UserStatus';
import Avatar from '~v5/shared/Avatar';
import CopyableAddress from '~v5/shared/CopyableAddress';

import { UserAvatarDetailsProps } from './types';

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
    <div className="grid grid-cols-[auto,1fr] gap-x-4 items-center">
      {!!userStatus && userStatus === 'verified' ? (
        <Avatar
          size={size}
          title={userName}
          avatar={avatar}
          mode={userStatus}
          seed={walletAddress.toLowerCase()}
        />
      ) : (
        <div className="flex relative justify-center">
          <div
            className={clsx('rounded-full flex', {
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
        <div className="grid grid-cols-[auto,1fr] gap-x-2 items-center mb-0.5">
          <p className="heading-4 truncate">{userName || walletAddress}</p>
          {isVerified && (
            <span className="flex shrink-0 text-blue-400">
              <Icon name="verified" appearance={{ size: 'tiny' }} />
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
