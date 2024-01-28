import { type ButtonHTMLAttributes } from 'react';

import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';

import { type StepStage } from './consts.ts';

export interface StepperButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  stage: StepStage;
  isHighlighted?: boolean;
  className?: string;
  iconName?: string;
  tooltipProps?: TooltipProps;
}
