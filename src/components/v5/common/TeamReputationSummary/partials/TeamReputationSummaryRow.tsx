import React, { FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip';

import { TeamPointsRowProps } from '../types';
import { formatPercentage, setTeamColor } from '../utils';

const displayName =
  'v5.common.TeamReputationSummary.partials.TeamReputationSummaryRow';

const TeamReputationSummaryRow: FC<TeamPointsRowProps> = ({
  team: { reputationPercentage: totalReputation, metadata },
}) => {
  const { color, name } = metadata ?? {};

  return (
    <>
      <div className="flex items-center flex-grow">
        <div
          className={`flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 ${setTeamColor(
            color,
          )}`}
        />
        <span className="truncate max-w-[8.5rem] sm:max-w-[7.25rem]">
          {name}
        </span>
      </div>
      <Tooltip tooltipContent={`${totalReputation || '0.00'}%`} placement="top">
        <span className="font-medium">{formatPercentage(totalReputation)}</span>
      </Tooltip>
    </>
  );
};

TeamReputationSummaryRow.displayName = displayName;

export default TeamReputationSummaryRow;
