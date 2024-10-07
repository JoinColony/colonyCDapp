import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/TeamBadge.tsx';

interface TeamFieldProps {
  teamId: number;
}

const TeamField: FC<TeamFieldProps> = ({ teamId }) => {
  const { colony } = useColonyContext();
  const currentTeam = colony?.domains?.items.find(
    (domain) => domain?.nativeId === teamId,
  );

  return currentTeam ? (
    <TeamBadge
      name={currentTeam.metadata?.name || ''}
      color={currentTeam.metadata?.color}
    />
  ) : (
    <div />
  );
};

export default TeamField;
