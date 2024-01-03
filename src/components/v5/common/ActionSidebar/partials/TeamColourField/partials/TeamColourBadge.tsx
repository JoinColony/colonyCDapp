import clsx from 'clsx';
import React, { FC } from 'react';

import { useColonyContext } from '~hooks';
import PillsBase from '~v5/common/Pills/PillsBase';
import {
  setTeamBadge,
  setTeamColor,
} from '~v5/common/TeamReputationSummary/utils';

import { TeamColourBadgeProps } from '../types';

const displayName =
  'v5.common.ActionsContent.partials.TeamColourField.partials.TeamColourBadge';

const TeamColourBadge: FC<TeamColourBadgeProps> = ({ title, defaultColor }) => {
  const { colony } = useColonyContext();

  const selectedTeam = colony?.domains?.items.find(
    (domain) => domain?.metadata?.name === title,
  );
  const color = setTeamColor(defaultColor || selectedTeam?.metadata?.color);
  const badgeColor = setTeamBadge(
    defaultColor || selectedTeam?.metadata?.color,
  );

  return (
    <div className="flex items-center gap-1">
      <span className={clsx(color, 'mr-2 w-[1.125rem] h-[1.125rem] rounded')} />
      <PillsBase className={`bg-base-white border ${badgeColor}`}>
        {title}
      </PillsBase>
    </div>
  );
};

TeamColourBadge.displayName = displayName;

export default TeamColourBadge;
