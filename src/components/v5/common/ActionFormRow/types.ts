import { type UseToggleReturnType } from '~hooks/useToggle/types.ts';
import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';

import type React from 'react';

export interface ActionFormRowProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  isExpandable?: boolean;
  isMultiLine?: boolean;
  fieldName?: string;
  className?: string;
  children?:
    | ((props: UseToggleReturnType) => React.ReactNode)
    | React.ReactNode;
  tooltips?: {
    label?: TooltipProps;
    content?: TooltipProps;
  };
}
