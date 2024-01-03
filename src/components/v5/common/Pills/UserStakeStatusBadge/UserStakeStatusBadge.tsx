import clsx from 'clsx';
import React, { FC } from 'react';

import { UserStakeStatus } from '~types';

import PillsBase from '../PillsBase';
import { UserStakeStatusBadgeProps } from '../types';

const displayName = 'v5.common.Pills.UserStakeStatusBadge';

const UserStakeStatusBadge: FC<UserStakeStatusBadgeProps> = ({
  status,
  ...rest
}) => (
  <PillsBase
    className={clsx({
      'text-success-400 bg-success-100': status === UserStakeStatus.Staking,
      'text-blue-400 bg-blue-100':
        status === UserStakeStatus.Finalizable ||
        status === UserStakeStatus.Claimable,
      'text-gray-500 bg-gray-100': status === UserStakeStatus.Claimed,
    })}
    {...rest}
  >
    {status}
  </PillsBase>
);

UserStakeStatusBadge.displayName = displayName;

export default UserStakeStatusBadge;
