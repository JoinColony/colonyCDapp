import { type Placement as PlacementType } from '@popperjs/core';
import { type ReactNode } from 'react';
import { type PopperOptions, type TriggerType } from 'react-popper-tooltip';

export interface TooltipProps {
  tooltipContent: ReactNode;
  trigger?: TriggerType | TriggerType[] | null;
  placement?: PlacementType;
  offset?: [number, number];
  popperOptions?: PopperOptions;
  interactive?: boolean;
  showArrow?: boolean;
  isOpen?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  isFullWidthContent?: boolean;
  className?: string;
  selectTriggerRef?: (ref: HTMLElement | null) => HTMLElement | null;
}
