import React, { FC } from 'react';
import { LockKey } from 'phosphor-react';

import { formatText } from '~utils/intl';
import Tooltip from '~shared/Extensions/Tooltip';

import ColonyLinks from './partials/ColonyLinks';
import { ColonyDashboardHeaderProps } from './types';

const displayName = 'v5.common.ColonyDashboardHeader';

const ColonyDashboardHeader: FC<ColonyDashboardHeaderProps> = ({
  colonyLinksProps,
  colonyName,
  description,
  tokenName,
  isTokenUnlocked,
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <h1 className="heading-2 text-gray-900 capitalize truncate">
        {colonyName}
      </h1>
      <div className="flex items-center gap-[0.225rem] text-gray-900 bg-base-bg rounded-lg p-1.5">
        <span className="text-3">{tokenName}</span>
        {!isTokenUnlocked && (
          <Tooltip
            tooltipContent={formatText({ id: 'colony.tooltip.lockedToken' })}
          >
            <LockKey size={11} />
          </Tooltip>
        )}
      </div>
    </div>
    <div className="flex flex-col md:flex-row gap-[1.7rem] sm:gap-4 items-start justify-between">
      <p className="text-gray-700 max-w-[52.75rem] text-md line-clamp-2">
        {description}
      </p>
      <div className="flex-shrink-0 pt-1">
        <ColonyLinks {...colonyLinksProps} />
      </div>
    </div>
  </div>
);

ColonyDashboardHeader.displayName = displayName;

export default ColonyDashboardHeader;
