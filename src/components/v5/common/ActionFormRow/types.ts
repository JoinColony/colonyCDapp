import React from 'react';
import { UseToggleReturnType } from '~hooks/useToggle/types';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

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
