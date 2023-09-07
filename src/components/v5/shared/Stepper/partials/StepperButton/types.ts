import { ButtonHTMLAttributes } from 'react';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';
import { STEP_STAGE } from './consts';

export type StepStage = (typeof STEP_STAGE)[keyof typeof STEP_STAGE];

export interface StepperButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  stage: StepStage;
  isHighlighted?: boolean;
  className?: string;
  iconName?: string;
  tooltipProps?: TooltipProps;
}
