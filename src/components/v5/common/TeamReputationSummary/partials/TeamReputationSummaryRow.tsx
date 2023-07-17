import React, { FC } from 'react';
import Decimal from 'decimal.js';

import { setTeamColor } from '../utils';
import { TeamPointsRowProps } from '../types';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Numeral from '~shared/Numeral';
import { useTeamReputationSummaryRow } from './hooks';
import { useColonyContext } from '~hooks';

const displayName =
  'v5.common.TeamReputationSummary.partials.TeamReputationSummaryRow';

const TeamReputationSummaryRow: FC<TeamPointsRowProps> = ({
  id,
  color,
  name,
}) => {
  const { colony } = useColonyContext();
  const { totalReputation } = useTeamReputationSummaryRow(id);

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
      <span className="font-medium">
        <Numeral
          value={new Decimal(totalReputation?.getUserReputation || '0')
            .abs()
            .toString()}
          decimals={colony?.nativeToken?.decimals || DEFAULT_TOKEN_DECIMALS}
        />
      </span>
    </>
  );
};

TeamReputationSummaryRow.displayName = displayName;

export default TeamReputationSummaryRow;
