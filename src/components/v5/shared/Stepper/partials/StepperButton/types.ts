import { ButtonHTMLAttributes } from 'react';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';
import { StepStage } from './consts';

export interface StepperButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  stage: StepStage;
  isHighlighted?: boolean;
  className?: string;
  iconName?: string;
  tooltipProps?: TooltipProps;
}
