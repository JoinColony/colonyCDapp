import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';

export interface IconWithTooltipProps {
  tooltipContent: ReactNode;
  icon: Icon;
  size: number;
  className?: string;
}
