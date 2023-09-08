import React, { FC } from 'react';
import clsx from 'clsx';

import Avatar from '~v5/shared/Avatar';
import Link from '~v5/shared/Link';
import { AvatarUserProps } from './types';

const displayName = 'v5.AvatarUser';

const AvatarUser: FC<AvatarUserProps> = ({
  walletAddress,
  avatar,
  hasAvatarDecor,
  userStatus,
  userName,
  size,
  href,
}) => {
  const avatarImage = (
    <span className="flex rounded-full items-center">
      <span
        className={clsx('flex rounded-full', {
          'border-2 border-blue-400 ':
            userStatus === 'dedicated' && hasAvatarDecor,
          'border-2 border-warning-400':
            userStatus === 'active' && hasAvatarDecor,
          'border-2 border-green-400': userStatus === 'new' && hasAvatarDecor,
          'border-2 border-purple-400': userStatus === 'top' && hasAvatarDecor,
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

  if (href) {
    return (
      <Link
        className="inline-flex transition-all duration-normal md:hover:text-blue-400"
        to={href}
      >
        {avatarImage}
      </Link>
    );
  }

  return avatarImage;
};

AvatarUser.displayName = displayName;

export default AvatarUser;
