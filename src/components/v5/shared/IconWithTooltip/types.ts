import React from 'react';

export interface IconWithTooltipProps {
  iconName: string;
  tooltipContent: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}
