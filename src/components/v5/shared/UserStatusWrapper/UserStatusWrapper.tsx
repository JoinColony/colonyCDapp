import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';

import { type UserStatusMode } from '~v5/common/Pills/types.ts';

const displayName = 'v5.UserStatusWrapper';

type UserStatusWrapperProps = PropsWithChildren<{
  userStatus: UserStatusMode;
}>;

const UserStatusWrapper = ({
  children,
  userStatus,
}: UserStatusWrapperProps) => {
  return (
    <span
      className={clsx('flex rounded-full border-2', {
        'border-blue-400': userStatus === 'dedicated',
        'border-warning-400': userStatus === 'active',
        'border-green-400': userStatus === 'new',
        'border-purple-400': userStatus === 'top',
      })}
    >
      {children}
    </span>
  );
};

UserStatusWrapper.displayName = displayName;
export default UserStatusWrapper;
