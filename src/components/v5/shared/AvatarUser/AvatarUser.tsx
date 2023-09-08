import React, { FC } from 'react';
import clsx from 'clsx';

import Avatar from '~v5/shared/Avatar';
import Link from '~v5/shared/Link';
import { AvatarUserProps } from './types';

const displayName = 'v5.AvatarUser';

const AvatarUser: FC<AvatarUserProps> = ({
  walletAddress,
  avatar,
  isContributorsList,
  userStatus,
  userName,
  size,
  isLink = false,
}) => {
  const avatarImage = (
    <span className="grid grid-cols-[auto,1fr] rounded-full items-center">
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
          avatar={avatar}
          placeholderIcon="circle-person"
          seed={walletAddress && walletAddress.toLowerCase()}
        />
      </span>
      {userName && (
        <p
          className={clsx('font-medium truncate', {
            'text-sm ml-1': size === 'xxs',
            'text-md ml-2': size === 'xs' || size === 'sm',
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
        {avatarImage}
      </Link>
    );
  }

  return avatarImage;
};

AvatarUser.displayName = displayName;

export default AvatarUser;
