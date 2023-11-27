import React, { FC } from 'react';

import PillsBase from '../PillsBase';
import { PillsProps } from '../types';

const displayName = 'v5.common.Pills.PermissionsBadge';

const PermissionsBadge: FC<PillsProps> = ({ text, iconName, ...rest }) => (
  <PillsBase
    className="bg-base-white border border-gray-100"
    iconName={iconName}
    {...rest}
  >
    {text}
  </PillsBase>
);

PermissionsBadge.displayName = displayName;

export default PermissionsBadge;
