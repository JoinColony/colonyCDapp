import clsx from 'clsx';
import React, { type PropsWithChildren, type FC } from 'react';

import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import Link from '~v5/shared/Link/index.ts';

const displayName = 'v5.common.MemberSignature.partials.MemberAvatar';

type MemberAvatarProps = PropsWithChildren<{
  className?: string;
  hasAvatarDecor?: boolean;
  userStatus?: UserStatusMode;
  userName?: string;
  href?: string;
}>;

const MemberAvatar: FC<MemberAvatarProps> = ({
  className,
  children,
  hasAvatarDecor,
  userStatus,
  userName,
  href,
}) => {
  const nameAndAvatar = (
    <div className={clsx('flex rounded-full items-center text-sm', className)}>
      <span
        className={clsx('flex rounded-full', {
          'border-2': hasAvatarDecor,
          'border-blue-400 ': userStatus === 'dedicated' && hasAvatarDecor,
          'border-warning-400': userStatus === 'active' && hasAvatarDecor,
          'border-green-400': userStatus === 'new' && hasAvatarDecor,
          'border-purple-400': userStatus === 'top' && hasAvatarDecor,
        })}
      >
        {children}
      </span>
      {userName && <p className="font-medium truncate ml-1">{userName}</p>}
    </div>
  );

  if (href) {
    return (
      <Link
        className="inline-flex transition-all duration-normal md:hover:text-blue-400"
        to={href}
      >
        {nameAndAvatar}
      </Link>
    );
  }

  return nameAndAvatar;
};

MemberAvatar.displayName = displayName;

export default MemberAvatar;
