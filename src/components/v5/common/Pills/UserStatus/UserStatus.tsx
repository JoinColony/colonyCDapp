import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { getIcon } from '~v5/shared/CardWithBios/partials/consts.ts';

import PillsBase from '../PillsBase.tsx';

import { type UserStatusProps } from './types.ts';

const displayName = 'v5.common.Pills.UserStatus';

const UserStatus: FC<PropsWithChildren<UserStatusProps>> = ({
  mode,
  children,
  text,
  className,
  isFilled,
  ...rest
}) => (
  <PillsBase
    className={clsx(className, {
      'bg-blue-100 text-blue-400': mode === 'dedicated' && !isFilled,
      'bg-blue-400 text-base-white':
        mode === 'dedicated-filled' || (mode === 'dedicated' && isFilled),
      'bg-warning-100 text-warning-400': mode === 'active' && !isFilled,
      'bg-warning-400 text-base-white':
        mode === 'active-filled' || (mode === 'active' && isFilled),
      'bg-success-100 text-success-400': mode === 'new' && !isFilled,
      'bg-success-400 text-base-white':
        mode === 'active-new' || (mode === 'new' && isFilled),
      'bg-purple-100 text-purple-400': mode === 'top' && !isFilled,
      'bg-purple-400 text-base-white':
        mode === 'top-filled' ||
        mode === 'team' ||
        (mode === 'top' && isFilled),
      'bg-negative-100 text-negative-400': mode === 'banned',
      'w-full max-w-[4.5rem] justify-center truncate': mode === 'team',
    })}
    icon={getIcon(mode)}
    pillSize="small"
    {...rest}
  >
    {text || children}
  </PillsBase>
);

UserStatus.displayName = displayName;

export default UserStatus;
