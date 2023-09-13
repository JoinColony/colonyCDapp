import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import Tooltip from '~shared/Extensions/Tooltip';
import Icon from '~shared/Icon';
import { IconWithTooltipProps } from './type';

const displayName = 'v5.IconWithTooltip';

const IconWithTooltip: FC<PropsWithChildren<IconWithTooltipProps>> = ({
  iconName,
  tooltipContent,
  className,
  hasMaxWidthTooltipContent = true,
  isIconVisible = true,
  children,
}) => (
  <Tooltip
    tooltipContent={tooltipContent}
    hasMaxWidthTooltipContent={hasMaxWidthTooltipContent}
    className="flex items-center"
  >
    {children}
    {isIconVisible && (
      <span className={clsx(className, 'flex')}>
        <Icon name={iconName} />
      </span>
    )}
  </Tooltip>
);

IconWithTooltip.displayName = displayName;

export default IconWithTooltip;
