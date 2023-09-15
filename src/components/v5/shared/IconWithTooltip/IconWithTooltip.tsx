import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { IconWithTooltipProps } from './types';

const displayName = 'v5.IconWithTooltip';

const IconWithTooltip: FC<PropsWithChildren<IconWithTooltipProps>> = ({
  iconName,
  tooltipContent,
  className,
  children,
  onClick,
  ariaLabel,
}) => (
  <Tooltip tooltipContent={tooltipContent} className="flex items-center">
    {children}
    <button type="button" aria-label={ariaLabel} onClick={onClick}>
      <span className={clsx(className, 'flex')}>
        <Icon name={iconName} />
      </span>
    </button>
  </Tooltip>
);

IconWithTooltip.displayName = displayName;

export default IconWithTooltip;
