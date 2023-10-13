import React, { FC } from 'react';

import { PermissionsBadgeProps } from './types';
import PillsBase from '../PillsBase';

const displayName = 'v5.common.Pills.PermissionsBadge';

const PermissionsBadge: FC<PermissionsBadgeProps> = ({ text, iconName }) => (
  <PillsBase
    className="bg-base-white border border-gray-100"
    iconName={iconName}
  >
    {text}
  </PillsBase>
);

PermissionsBadge.displayName = displayName;

export default PermissionsBadge;
