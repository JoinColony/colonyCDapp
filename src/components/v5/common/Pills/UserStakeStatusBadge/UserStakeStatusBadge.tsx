import clsx from 'clsx';
import React, { type FC } from 'react';

import { UserStakeStatus } from '~types/userStake.ts';

import PillsBase from '../PillsBase.tsx';
import { type UserStakeStatusBadgeProps } from '../types.ts';

const displayName = 'v5.common.Pills.UserStakeStatusBadge';

const UserStakeStatusBadge: FC<UserStakeStatusBadgeProps> = ({
  status,
  ...rest
}) => (
  <PillsBase
    className={clsx({
      'bg-success-100 text-success-400': status === UserStakeStatus.Staking,
      'bg-blue-100 text-blue-400':
        status === UserStakeStatus.Finalizable ||
        status === UserStakeStatus.Claimable,
      'bg-gray-100 text-gray-500':
        status === UserStakeStatus.Claimed ||
        status === UserStakeStatus.Unknown,
      'bg-negative-100 text-negative-400': status === UserStakeStatus.Lost,
    })}
    {...rest}
  >
    {status}
  </PillsBase>
);

UserStakeStatusBadge.displayName = displayName;

export default UserStakeStatusBadge;
