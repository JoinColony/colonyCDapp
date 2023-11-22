import clsx from 'clsx';
import React, { FC } from 'react';

import PillsBase from '../PillsBase';
import { PillsProps } from '../types';

const displayName = 'v5.common.Pills.PermissionsBadge';

const PermissionsBadge: FC<PillsProps> = ({
  text,
  iconName,
  className,
  ...rest
}) => (
  <PillsBase
    className={clsx('bg-base-white border border-gray-100', className)}
    iconName={iconName}
    {...rest}
  >
    {text}
  </PillsBase>
);

PermissionsBadge.displayName = displayName;

export default PermissionsBadge;
