import { ReactNode } from 'react';
import { PopperOptions, TriggerType } from 'react-popper-tooltip';
import { Placement as PlacementType } from '@popperjs/core';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  trigger?: TriggerType | TriggerType[] | null;
  placement?: PlacementType;
  popperOptions?: PopperOptions;
  showArrow?: boolean;
  isOpen?: boolean;
}
