import { type Icon } from '@phosphor-icons/react';
import { type ButtonHTMLAttributes } from 'react';

import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';

import { type StepStage } from './consts.ts';

export interface StepperButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  stage: StepStage;
  isHighlighted?: boolean;
  className?: string;
  icon?: Icon;
  tooltipProps?: TooltipProps;
  highlightedClassName?: string;
}
