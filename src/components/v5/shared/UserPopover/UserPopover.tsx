import clsx from 'clsx';
import React, { type FC } from 'react';

import MaskedAddress from '~shared/MaskedAddress/index.ts';

import { UserAvatar } from '../UserAvatar/UserAvatar.tsx';
import UserInfoPopover from '../UserInfoPopover/index.ts';

import { type UserPopoverProps } from './types.ts';

const displayName = 'v5.UserPopover';

const UserPopover: FC<UserPopoverProps> = ({
  size,
  popperOptions,
  walletAddress,
  withVerifiedBadge,
  additionalContent,
  className,
  textClassName = 'text-md',
}) => (
  <UserInfoPopover
    walletAddress={walletAddress}
    className={className}
    popperOptions={popperOptions}
    withVerifiedBadge={withVerifiedBadge}
  >
    {(user) => {
      const { displayName: userDisplayName, avatar } = user?.profile || {};

      return (
        <div className="flex items-center">
          <UserAvatar
            size={size}
            userAvatarSrc={avatar ?? undefined}
            userName={userDisplayName ?? undefined}
            userAddress={walletAddress}
          />
          <p className={clsx('ml-2 truncate font-medium', textClassName)}>
            {userDisplayName ?? (
              <MaskedAddress
                address={walletAddress}
                className={`!${textClassName} !font-medium`}
              />
            )}
          </p>
          {additionalContent}
        </div>
      );
    }}
  </UserInfoPopover>
);

UserPopover.displayName = displayName;

export default UserPopover;
