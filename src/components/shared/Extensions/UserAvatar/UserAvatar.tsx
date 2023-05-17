import React, { FC } from 'react';
import clsx from 'clsx';

import styles from './UserAvatar.module.css';
import { UserAvatarProps } from './types';
import Avatar from '~shared/Extensions/Avatar';
import Link from '~shared/NavLink';

const displayName = 'Extensions.UserAvatar';

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  isLink = false,
  preferThumbnail = true,
  userName,
  size = 'xxs',
  ...rest
}) => {
  const address = user?.walletAddress;
  const { profile } = user || {};
  const imageString = preferThumbnail ? profile?.thumbnail : profile?.avatar;

  const avatar = (
    <span className={clsx(styles.main, 'inline-flex items-center text-current')}>
      <Avatar
        size={size}
        avatar={imageString}
        placeholderIcon="circle-person"
        seed={address && address.toLowerCase()}
        title={profile?.displayName || user?.name || address || ''}
        {...rest}
      />
      <span className={clsx('block font-medium', { 'text-sm ml-1': size === 'xxs', 'text-md ml-2': size === 'xs' })}>
        {userName}
      </span>
    </span>
  );

  if (isLink) {
    return (
      <Link className="inline-flex transition-all duration-normal hover:text-blue-400" to="/user/">
        {avatar}
      </Link>
    );
  }

  return avatar;
};

UserAvatar.displayName = displayName;

export default UserAvatar;
