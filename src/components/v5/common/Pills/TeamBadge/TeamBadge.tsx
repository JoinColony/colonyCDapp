import clsx from 'clsx';
import React, { FC } from 'react';

import PillsBase from '../PillsBase';
import { useTeamBadge } from './hooks';
import { TeamBadgeProps } from './types';

const displayName = 'v5.common.Pills.TeamBadge';

const TeamBadge: FC<TeamBadgeProps> = ({ teamName, className, ...rest }) => {
  const teamColor = useTeamBadge(teamName || '');

  return (
    <PillsBase
      {...rest}
      className={clsx(className, 'bg-base-white border', teamColor)}
    >
      {teamName}
    </PillsBase>
  );
};

TeamBadge.displayName = displayName;

export default TeamBadge;
