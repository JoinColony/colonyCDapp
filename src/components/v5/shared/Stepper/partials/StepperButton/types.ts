import { ButtonHTMLAttributes } from 'react';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

export interface StepperButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  stage: 'completed' | 'current' | 'upcoming' | 'skipped';
  isHighlighted?: boolean;
  className?: string;
  iconName?: string;
  tooltipProps?: TooltipProps;
}
