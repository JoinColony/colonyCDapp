import clsx from 'clsx';
import React, { type FC } from 'react';

import PillsBase from '../PillsBase.tsx';

import { type PenaliseBadgeProps } from './types.ts';

const displayName = 'v5.common.Pills.PenaliseBadge';

const PenaliseBadge: FC<PenaliseBadgeProps> = ({
  text,
  icon,
  className,
  isPenalised,
  ...rest
}) => (
  <PillsBase
    className={clsx(
      'border border-teams-blue-50 bg-teams-blue-50 text-teams-blue-400',
      className,
      {
        'border-teams-pink-100 bg-teams-pink-100 text-teams-pink-500':
          isPenalised,
      },
    )}
    icon={icon}
    {...rest}
  >
    {text}
  </PillsBase>
);

PenaliseBadge.displayName = displayName;

export default PenaliseBadge;
