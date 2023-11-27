import React from 'react';
import { IconProps } from '~shared/Icon/Icon';

export interface IconWithTooltipProps {
  tooltipContent: React.ReactNode;
  iconProps: IconProps;
  className?: string;
}
