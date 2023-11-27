import React, { FC } from 'react';

import Icon from '~shared/Icon';
import Tooltip from '~shared/Extensions/Tooltip';
import { CardPermissionProps } from '../../types';

const displayName = 'v5.CardWithBios.partials.CardPermission';

const CardPermission: FC<CardPermissionProps> = ({ text, type }) => (
  <Tooltip tooltipContent={<span>{text}</span>}>
    <div className="text-gray-600 hover:text-blue-400 transition-all duration-normal cursor-pointer">
      <Icon name={type} appearance={{ size: 'extraTiny' }} />
    </div>
  </Tooltip>
);

CardPermission.displayName = displayName;

export default CardPermission;
