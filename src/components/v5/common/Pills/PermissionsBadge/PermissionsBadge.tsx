import clsx from 'clsx';
import React, { type FC } from 'react';

import PillsBase from '../PillsBase.tsx';
import { type PillsProps } from '../types.ts';

const displayName = 'v5.common.Pills.PermissionsBadge';

const PermissionsBadge: FC<PillsProps> = ({
  text,
  icon,
  className,
  ...rest
}) => (
  <PillsBase
    className={clsx('bg-base-white border border-gray-100', className)}
    icon={icon}
    {...rest}
  >
    {text}
  </PillsBase>
);

PermissionsBadge.displayName = displayName;

export default PermissionsBadge;
