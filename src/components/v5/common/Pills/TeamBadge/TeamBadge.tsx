import clsx from 'clsx';
import React, { type FC } from 'react';

import { DomainColor } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey.ts';
import { getTeamBadgeStyles } from '~utils/teams.ts';

import PillsBase from '../PillsBase.tsx';

import { type TeamBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.TeamBadge';

const TeamBadge: FC<TeamBadgeProps> = ({ name, color, className, ...rest }) => {
  const teamColor = getTeamBadgeStyles(
    color ? getEnumValueFromKey(DomainColor, color) : undefined,
  );

  return (
    <PillsBase
      {...rest}
      className={clsx(className, 'border bg-base-white', teamColor)}
    >
      {name}
    </PillsBase>
  );
};

TeamBadge.displayName = displayName;

export default TeamBadge;
