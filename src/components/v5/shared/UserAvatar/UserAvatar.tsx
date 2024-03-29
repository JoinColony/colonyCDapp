import { UserCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import Avatar from '~v5/shared/Avatar/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { type UserAvatarProps } from './types.ts';

const displayName = 'v5.UserAvatar';

const UserAvatar: FC<UserAvatarProps> = ({
  avatarSize,
  className,
  isContributorsList,
  isLink = false,
  preferThumbnail = true,
  showUsername = false,
  size = 'xxs',
  user,
  userStatus,
  ...rest
}) => {
  const address = typeof user == 'string' ? user : user.walletAddress;
  const profile = typeof user == 'string' ? null : user.profile;
  const username =
    typeof user != 'string'
      ? user.profile?.displayName
      : splitWalletAddress(address);
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;

  const avatar = (
    <span className="grid grid-cols-[auto,1fr] items-center rounded-full text-current">
      <span
        className={clsx('flex rounded-full', {
          'border-2 border-blue-400':
            userStatus === 'dedicated' && isContributorsList,
          'border-2 border-warning-400':
            userStatus === 'active' && isContributorsList,
          'border-green-400 border-2':
            userStatus === 'new' && isContributorsList,
          'border-2 border-purple-400':
            userStatus === 'top' && isContributorsList,
        })}
      >
        <Avatar
          size={avatarSize || size}
          avatar={imageString}
          placeholderIcon={UserCircle}
          seed={address && address.toLowerCase()}
          title={profile?.displayName || address || ''}
          className={className}
          {...rest}
        />
      </span>
      {showUsername ? (
        <p
          className={clsx(className, 'truncate font-medium', {
            'ml-1 text-sm': size === 'xxs',
            'ml-2 text-md': size === 'xs' || size === 'sm',
          })}
        >
          {username}
        </p>
      ) : null}
    </span>
  );

  if (isLink) {
    return (
      <Link
        className="inline-flex transition-all duration-normal hover:text-blue-400"
        to="/user/"
      >
        {avatar}
      </Link>
    );
  }

  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
