import React, { type FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';

import { type CardPermissionProps } from '../../types.ts';

const displayName = 'v5.CardWithBios.partials.CardPermission';

const CardPermission: FC<CardPermissionProps> = ({ text, icon: Icon }) => (
  <Tooltip tooltipContent={<span>{text}</span>}>
    <div className="text-gray-600 hover:text-blue-400 transition-all duration-normal cursor-pointer">
      <Icon size={12} />
    </div>
  </Tooltip>
);

CardPermission.displayName = displayName;

export default CardPermission;
