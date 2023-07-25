import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './UserAvatar.module.css';
import { UserAvatarProps } from './types';
import Avatar from '~v5/shared/Avatar';
import Link from '~v5/shared/Link';

const displayName = 'v5.UserAvatar';

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  isLink = false,
  preferThumbnail = true,
  userName,
  size = 'xxs',
  userStatus,
  isContributorsList,
  ...rest
}) => {
  const address = user?.walletAddress;
  const { profile } = user || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;

  const avatar = (
    <span
      className={clsx(
        styles.main,
        `${
          userStatus && isContributorsList ? 'gap-2' : ''
        } items-center text-current`,
      )}
    >
      <span
        className={clsx('flex rounded-full', {
          'border-2 border-blue-400 ':
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
          size={size}
          avatar={imageString}
          placeholderIcon="circle-person"
          seed={address && address.toLowerCase()}
          title={profile?.displayName || user?.name || address || ''}
          {...rest}
        />
      </span>
      {userName && (
        <p
          className={clsx('font-medium truncate', {
            'text-sm ml-1': size === 'xxs',
            'text-md ml-2': size === 'xs',
          })}
        >
          {userName}
        </p>
      )}
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
