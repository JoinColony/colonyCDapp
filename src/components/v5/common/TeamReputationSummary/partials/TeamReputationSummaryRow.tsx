import React, { type FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';

import { formatPercentage } from '../utils.ts';

const displayName =
  'v5.common.TeamReputationSummary.partials.TeamReputationSummaryRow';

interface TeamReputationSummaryRowProps {
  color: string;
  name?: string;
  totalReputation?: string | null;
}

const TeamReputationSummaryRow: FC<TeamReputationSummaryRowProps> = ({
  color,
  name,
  totalReputation,
}) => {
  return (
    <>
      <div className="flex items-center flex-grow">
        <div
          className={`flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 ${color}`}
        />
        <span className="truncate max-w-[8.5rem] sm:max-w-[7.25rem]">
          {name}
        </span>
      </div>
      <Tooltip tooltipContent={`${totalReputation || '0.00'}%`} placement="top">
        <span className="font-medium text-gray-600">
          {formatPercentage(totalReputation)}
        </span>
      </Tooltip>
    </>
  );
};

TeamReputationSummaryRow.displayName = displayName;

export default TeamReputationSummaryRow;
