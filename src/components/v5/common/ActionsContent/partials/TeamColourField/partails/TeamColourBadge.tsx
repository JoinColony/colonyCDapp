import React, { FC } from 'react';
import clsx from 'clsx';

import { setTeamColor } from '~v5/common/TeamReputationSummary/utils';
import PillsBase from '~v5/common/Pills/PillsBase';
import { TeamColourBadgeProps } from '../types';
import { useTeamBadge } from '~v5/common/Pills/TeamBadge/hooks';
import { useColonyContext } from '~hooks';

const displayName =
  'v5.common.ActionsContent.partials.TeamColourField.partials.TeamColourBadge';

const TeamColourBadge: FC<TeamColourBadgeProps> = ({ title }) => {
  const teamColor = useTeamBadge(title || '');
  const { colony } = useColonyContext();

  const selectedTeam = colony?.domains?.items.find(
    (domain) => domain?.metadata?.name === title,
  );
  const color = setTeamColor(selectedTeam?.metadata?.color);

  return (
    <div className="flex items-center gap-1">
      <span className={clsx(color, 'mr-2 w-[1.125rem] h-[1.125rem] rounded')} />
      <PillsBase className={`bg-base-white border ${teamColor}`}>
        {title}
      </PillsBase>
    </div>
  );
};

TeamColourBadge.displayName = displayName;

export default TeamColourBadge;
