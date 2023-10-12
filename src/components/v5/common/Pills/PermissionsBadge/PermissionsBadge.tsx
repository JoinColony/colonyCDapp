import React, { FC } from 'react';

import { PermissionsBadgeProps } from './types';
import PillsBase from '../PillsBase';

const PermissionsBadge: FC<PermissionsBadgeProps> = ({ text, isMultiSig }) => (
  <PillsBase
    className="bg-base-white border border-gray-100"
    iconName={isMultiSig ? 'users-three' : 'user'}
  >
    {text}
  </PillsBase>
);

export default PermissionsBadge;
