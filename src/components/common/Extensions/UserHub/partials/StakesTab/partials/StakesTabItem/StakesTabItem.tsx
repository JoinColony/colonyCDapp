import React, { FC } from 'react';

import UserStakeStatusBadge from '~v5/common/Pills/UserStakeStatusBadge';

import { StakesTabItemProps } from './types';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakesTabItem';

const StakesTabItem: FC<StakesTabItemProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
}) => (
  <div className="relative w-full">
    <div className="flex justify-between items-center">
      <div className="flex items-center mr-2 flex-grow">
        <p className="text-1 mr-2">{title}</p>
        <span className="text-gray-400 text-xs">{date}</span>
      </div>
      <UserStakeStatusBadge status={status} />
    </div>
    <div className="flex text-xs">
      <div className="font-medium mr-2">{stake}</div>
      <div className="text-gray-600">{transfer}</div>
    </div>
  </div>
);

StakesTabItem.displayName = displayName;

export default StakesTabItem;
