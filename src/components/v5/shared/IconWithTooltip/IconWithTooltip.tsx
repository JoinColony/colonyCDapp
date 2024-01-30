import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Icon from '~shared/Icon/index.ts';

import { type IconWithTooltipProps } from './types.ts';

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
