import React, { FC } from 'react';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import { ExtensionStatusBadgeMode } from '~v5/common/Pills/ExtensionStatusBadge/types';
import { StakesProps } from '../types';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakesItems';

const StakesItems: FC<StakesProps> = ({
  title,
  date,
  stake,
  transfer,
  status,
}) => {
  return (
    <li className="flex flex-col py-4 border-b-[0.0625rem] border-gray-100">
      <div className="relative w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 mr-2">
            <p className="text-1 mr-2">{title}</p>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>
          <ExtensionsStatusBadge
            mode={status as ExtensionStatusBadgeMode}
            text={status as ExtensionStatusBadgeMode}
          />
        </div>
        <div className="flex text-xs">
          <div className="font-medium mr-2">{stake}</div>
          <div className="text-gray-600">{transfer}</div>
        </div>
      </div>
    </li>
  );
};

StakesItems.displayName = displayName;

export default StakesItems;
