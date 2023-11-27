import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './UserAvatar.module.css';
import { UserAvatarProps } from './types';
import Avatar from '~v5/shared/Avatar';
import Link from '~v5/shared/Link';
import { splitWalletAddress } from '~utils/splitWalletAddress';

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
    <span className={clsx(styles.main, 'items-center text-current')}>
      <span
        className={clsx('flex rounded-full', {
          'border-2 border-blue-400':
            userStatus === 'dedicated' && isContributorsList,
          'border-2 border-warning-400':
            userStatus === 'active' && isContributorsList,
          'border-2 border-green-400':
            userStatus === 'new' && isContributorsList,
          'border-2 border-purple-400':
            userStatus === 'top' && isContributorsList,
        })}
      >
        <Avatar
          size={avatarSize || size}
          avatar={imageString}
          placeholderIcon="circle-person"
          seed={address && address.toLowerCase()}
          title={profile?.displayName || address || ''}
          className={className}
          {...rest}
        />
      </span>
      {showUsername ? (
        <p
          className={clsx(className, 'font-medium truncate', {
            'text-sm ml-1': size === 'xxs',
            'text-md ml-2': size === 'xs' || size === 'sm',
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
