import React, { FC } from 'react';

import { setTeamColor } from '../utils';
import { TeamPointsRowProps } from '../types';
import Numeral from '~shared/Numeral';

const displayName =
  'v5.common.TeamReputationSummary.partials.TeamReputationSummaryRow';

const TeamReputationSummaryRow: FC<TeamPointsRowProps> = ({
  team: { reputationPercentage, metadata },
  suffix,
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
        <p className="truncate max-w-[6.25rem] sm:max-w-[9.375rem]">{name}</p>
      </div>
      <div className="font-medium">
        <Numeral
          value={Number(reputationPercentage).toFixed(1)}
          suffix={suffix}
        />
      </div>
    </>
  );
};

TeamReputationSummaryRow.displayName = displayName;

export default TeamReputationSummaryRow;
