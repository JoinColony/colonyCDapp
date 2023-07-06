import React, { FC, PropsWithChildren } from 'react';
import { setTeamColor } from '../utils';
import { TeamPointsRowProps } from '../types';

const displayName =
  'v5.common.TeamReputationSummary.partials.TeamReputationSummaryRow';

const TeamReputationSummaryRow: FC<PropsWithChildren<TeamPointsRowProps>> = ({
  color,
  name,
  points,
}) => {
  return (
    <>
      <span className="flex items-center flex-grow">
        <span
          className={`flex rounded-full w-[0.625rem] h-[0.625rem] mr-2 ${setTeamColor(
            color,
          )}`}
        />
        {name}
      </span>
      <span className="font-medium">{points}</span>
    </>
  );
};

TeamReputationSummaryRow.displayName = displayName;

export default TeamReputationSummaryRow;
