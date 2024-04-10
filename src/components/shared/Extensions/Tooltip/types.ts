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
  className?: string;
  isError?: boolean;
  isCopyTooltip?: boolean;
  selectTriggerRef?: (ref: HTMLElement | null) => HTMLElement | null;
}
