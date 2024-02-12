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
      'text-blue-400 bg-blue-100': mode === 'dedicated' && !isFilled,
      'text-base-white bg-blue-400':
        mode === 'dedicated-filled' || (mode === 'dedicated' && isFilled),
      'text-warning-400 bg-warning-100': mode === 'active' && !isFilled,
      'text-base-white bg-warning-400':
        mode === 'active-filled' || (mode === 'active' && isFilled),
      'text-success-400 bg-success-100': mode === 'new' && !isFilled,
      'text-base-white bg-success-400':
        mode === 'active-new' || (mode === 'new' && isFilled),
      'text-purple-400 bg-purple-100': mode === 'top' && !isFilled,
      'text-base-white bg-purple-400':
        mode === 'top-filled' ||
        mode === 'team' ||
        (mode === 'top' && isFilled),
      'text-negative-400 bg-negative-100': mode === 'banned',
      'max-w-[4.5rem] w-full justify-center truncate': mode === 'team',
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
