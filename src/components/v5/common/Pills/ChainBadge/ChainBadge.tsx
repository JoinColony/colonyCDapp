import clsx from 'clsx';
import React, { type FC } from 'react';

import PillsBase from '../PillsBase.tsx';
import { type PillsProps } from '../types.ts';

const displayName = 'v5.common.Pills.ChainBadge';

const ChainBadge: FC<PillsProps> = ({ text, icon, className, ...rest }) => (
  <PillsBase
    className={clsx('border border-gray-100 bg-base-white', className)}
    icon={icon}
    {...rest}
  >
    {text}
  </PillsBase>
);

ChainBadge.displayName = displayName;

export default ChainBadge;
