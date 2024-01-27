import clsx from 'clsx';
import React, { FC } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { DomainColor } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { getTeamBadgeStyles, getTeamColor } from '~utils/teams.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

import { TeamColourBadgeProps } from '../types.ts';

const displayName =
  'v5.common.ActionsContent.partials.TeamColourField.partials.TeamColorBadge';

const TeamColourBadge: FC<TeamColourBadgeProps> = ({ title, defaultColor }) => {
  const { colony } = useColonyContext();

  const selectedTeam = colony.domains?.items.find(
    (domain) => domain?.metadata?.name === title,
  );
  const color = getTeamColor(
    defaultColor || selectedTeam?.metadata?.color
      ? getEnumValueFromKey(
          DomainColor,
          defaultColor || selectedTeam?.metadata?.color,
        )
      : undefined,
  );
  const badgeColor = getTeamBadgeStyles(
    defaultColor || selectedTeam?.metadata?.color
      ? getEnumValueFromKey(
          DomainColor,
          defaultColor || selectedTeam?.metadata?.color,
        )
      : undefined,
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
