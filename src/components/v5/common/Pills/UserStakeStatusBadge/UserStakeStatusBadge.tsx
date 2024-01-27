import clsx from 'clsx';
import React, { FC } from 'react';

import { UserStakeStatus } from '~types/userStake.ts';

import PillsBase from '../PillsBase.tsx';
import { UserStakeStatusBadgeProps } from '../types.ts';

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
