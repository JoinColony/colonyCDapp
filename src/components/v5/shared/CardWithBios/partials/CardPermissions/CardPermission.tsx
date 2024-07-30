import React, { type FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type CardPermissionProps } from '~v5/shared/CardWithBios/types.ts';

const displayName = 'v5.CardWithBios.partials.CardPermission';

const CardPermission: FC<CardPermissionProps> = ({ text, icon: Icon }) => (
  <Tooltip tooltipContent={<span>{text}</span>}>
    <div className="cursor-pointer text-gray-600 transition-all duration-normal hover:text-blue-400">
      <Icon size={12} />
    </div>
  </Tooltip>
);

CardPermission.displayName = displayName;

export default CardPermission;
