import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import PillsBase from '../PillsBase';
import { PillsProps } from '../types';
import { getIconName } from '~v5/shared/CardWithBios/partials/consts';

const displayName = 'v5.common.Pills.UserStatus';

const UserStatus: FC<PropsWithChildren<PillsProps>> = ({
  mode,
  children,
  text,
  ...rest
}) => (
  <PillsBase
    className={clsx({
      'text-blue-400 bg-blue-100': mode === 'dedicated',
      'text-base-white bg-blue-400': mode === 'dedicated-filled',
      'text-warning-400 bg-warning-100': mode === 'active',
      'text-base-white bg-warning-400': mode === 'active-filled',
      'text-success-400 bg-success-100': mode === 'new',
      'text-base-white bg-success-400': mode === 'active-new',
      'text-purple-400 bg-purple-100': mode === 'top',
      'text-base-white bg-purple-400': mode === 'top-filled' || mode === 'team',
      'text-negative-400 bg-negative-100': mode === 'banned',
    })}
    iconName={getIconName(mode)}
    pillSize="small"
    {...rest}
  >
    {text || children}
  </PillsBase>
);

UserStatus.displayName = displayName;

export default UserStatus;
