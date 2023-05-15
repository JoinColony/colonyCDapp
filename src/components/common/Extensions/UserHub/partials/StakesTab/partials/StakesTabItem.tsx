import React, { FC } from 'react';
import ExtensionsStatusBadge from '~common/Extensions/ExtensionStatusBadge-new';
import { ExtensionStatusBadgeMode } from '~common/Extensions/ExtensionStatusBadge-new/types';
import { StakesProp } from '../types';

const displayName = 'common.Extensions.UserHub.partials.StakesTab.partials.StakesItems';

const StakesItems: FC<StakesProp> = ({ title, date, stake, transfer, status }) => {
  return (
    <li className="flex flex-col py-4 border-b-[0.0625rem] border-gray-200">
      <div className="relative w-full">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-[0.125rem]">
            <div className="text-gray-900 text-md font-medium mr-2">{title}</div>
            <div className="text-gray-400 text-xs font-normal">{date}</div>
          </div>
          <ExtensionsStatusBadge mode={status as ExtensionStatusBadgeMode} text={status as ExtensionStatusBadgeMode} />
        </div>
        <div className="flex flex-row">
          <div className="text-gray-400 text-xs font-medium mr-2">{stake}</div>
          <div className="text-gray-600 text-xs font-normal">{transfer}</div>
        </div>
      </div>
    </li>
  );
};

StakesItems.displayName = displayName;

export default StakesItems;
