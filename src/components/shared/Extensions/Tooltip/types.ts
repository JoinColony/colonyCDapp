import { ReactNode } from 'react';
import { PopperOptions, TriggerType } from 'react-popper-tooltip';
import { Placement as PlacementType } from '@popperjs/core';

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
}
