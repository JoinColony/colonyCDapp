import clsx from 'clsx';
import React from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DomainColor } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { getTeamBadgeStyles, getTeamColor } from '~utils/teams.ts';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';

interface Props {
  title: string;
  defaultColor?: DomainColor;
}

const displayName =
  'v5.common.ActionsContent.partials.TeamColourField.partials.TeamColorBadge';

const TeamColorBadge = ({ title, defaultColor }: Props) => {
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
    <div className="flex items-center gap-1" data-testid="team-color-badge">
      <span className={clsx(color, 'mr-2 h-[1.125rem] w-[1.125rem] rounded')} />
      <PillsBase
        className={`border bg-base-white ${badgeColor}`}
        isCapitalized={false}
      >
        {title}
      </PillsBase>
    </div>
  );
};

TeamColorBadge.displayName = displayName;

export default TeamColorBadge;
