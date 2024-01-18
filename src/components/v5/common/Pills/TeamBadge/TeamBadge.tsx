import clsx from 'clsx';
import React, { FC } from 'react';

import { DomainColor } from '~gql';
import { getEnumValueFromKey } from '~utils/getEnumValueFromKey';
import { getTeamBadgeStyles } from '~utils/teams';

import PillsBase from '../PillsBase';

import { TeamBadgeProps } from './types';

const displayName = 'v5.common.Pills.TeamBadge';

const TeamBadge: FC<TeamBadgeProps> = ({ name, color, className, ...rest }) => {
  const teamColor = getTeamBadgeStyles(
    color ? getEnumValueFromKey(DomainColor, color) : undefined,
  );

  return (
    <PillsBase
      {...rest}
      className={clsx(className, 'bg-base-white border', teamColor)}
    >
      {name}
    </PillsBase>
  );
};

TeamBadge.displayName = displayName;

export default TeamBadge;
