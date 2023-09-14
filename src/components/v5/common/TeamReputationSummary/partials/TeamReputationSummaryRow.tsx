import React, { FC } from 'react';
import Decimal from 'decimal.js';

import { setTeamColor } from '../utils';
import { TeamPointsRowProps } from '../types';
import Numeral from '~shared/Numeral';

const displayName =
  'v5.common.TeamReputationSummary.partials.TeamReputationSummaryRow';

const TeamReputationSummaryRow: FC<TeamPointsRowProps> = ({
  team: { reputation: totalReputation, metadata },
}) => {
  const { color, name } = metadata ?? {};

  return (
    <>
      <span className="flex items-center flex-grow">
        <span
          className={`flex rounded-full flex-shrink-0 w-[0.625rem] h-[0.625rem] mr-2 ${setTeamColor(
            color,
          )}`}
        />
        {name}
      </span>
      <span className="font-medium">
        <Numeral value={new Decimal(totalReputation ?? '0').abs().toString()} />
      </span>
    </>
  );
};

TeamReputationSummaryRow.displayName = displayName;

export default TeamReputationSummaryRow;
