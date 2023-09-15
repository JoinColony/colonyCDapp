import React from 'react';
import { UseToggleReturnType } from '~hooks/useToggle/types';
import { TooltipProps } from '~shared/Extensions/Tooltip/types';

export interface ActionFormRowProps {
  iconName: string;
  title: React.ReactNode;
  isExpandable?: boolean;
  fieldName?: string;
  children?:
    | ((props: UseToggleReturnType) => React.ReactNode)
    | React.ReactNode;
  tooltip?: TooltipProps['tooltipContent'];
}
