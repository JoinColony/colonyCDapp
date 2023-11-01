import React, { FC } from 'react';

import PillsBase from '../PillsBase';
import { PillsProps } from '../types';
import { useTeamBadge } from './hooks';

const displayName = 'v5.common.Pills.TeamBadge';

const TeamBadge: FC<PillsProps> = ({ teamName }) => {
  const teamColor = useTeamBadge(teamName || '');

  return (
    <PillsBase className={`bg-base-white border ${teamColor}`}>
      {teamName}
    </PillsBase>
  );
};

TeamBadge.displayName = displayName;

export default TeamBadge;
