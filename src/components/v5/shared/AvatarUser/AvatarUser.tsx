import { UserCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import Avatar from '~v5/shared/Avatar/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { type AvatarUserProps } from './types.ts';

const displayName = 'v5.AvatarUser';

const AvatarUser: FC<AvatarUserProps> = ({
  avatar,
  hasAvatarDecor,
  userStatus,
  userName,
  size,
  href,
  ...rest
}) => {
  const avatarImage = (
    <div className="flex items-center rounded-full">
      <span
        className={clsx('flex rounded-full', {
          'border-2': hasAvatarDecor,
          'border-blue-400 ': userStatus === 'dedicated' && hasAvatarDecor,
          'border-warning-400': userStatus === 'active' && hasAvatarDecor,
          'border-green-400': userStatus === 'new' && hasAvatarDecor,
          'border-purple-400': userStatus === 'top' && hasAvatarDecor,
        })}
      >
        <Avatar
          size={size}
          avatar={avatar}
          placeholderIcon={UserCircle}
          {...rest}
        />
      </span>
      {userName && (
        <p
          className={clsx('truncate font-medium', {
            'ml-1 text-sm': size === 'xxs',
            'ml-2 text-md': size === 'xs' || size === 'sm',
          })}
        >
          {userName}
        </p>
      )}
    </div>
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
