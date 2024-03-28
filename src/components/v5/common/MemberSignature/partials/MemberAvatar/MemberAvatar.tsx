import clsx from 'clsx';
import React, { type PropsWithChildren, type FC } from 'react';

import Link from '~v5/shared/Link/index.ts';

const displayName = 'v5.common.MemberSignature.partials.MemberAvatar';

type MemberAvatarProps = PropsWithChildren<{
  className?: string;
  userName?: string;
  href?: string;
}>;

const MemberAvatar: FC<MemberAvatarProps> = ({
  className,
  children,
  userName,
  href,
}) => {
  const nameAndAvatar = (
    <div className={clsx('flex items-center text-sm', className)}>
      {children}
      {userName && <p className="ml-1 truncate font-medium">{userName}</p>}
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
