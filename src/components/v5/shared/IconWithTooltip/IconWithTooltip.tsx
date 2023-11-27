import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { IconWithTooltipProps } from './types';

const displayName = 'v5.IconWithTooltip';

const IconWithTooltip: FC<PropsWithChildren<IconWithTooltipProps>> = ({
  tooltipContent,
  className,
  children,
  iconProps,
}) => (
  <Tooltip tooltipContent={tooltipContent} className="flex items-center">
    {children}
    <span className={clsx(className, 'flex')}>
      <Icon {...iconProps} />
    </span>
  </Tooltip>
);

IconWithTooltip.displayName = displayName;

export default IconWithTooltip;
