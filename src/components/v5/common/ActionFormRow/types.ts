import { type Icon } from '@phosphor-icons/react';
import { type ReactNode } from 'react';

import { type UseToggleReturnType } from '~hooks/useToggle/types.ts';
import { type TooltipProps } from '~shared/Extensions/Tooltip/types.ts';

export interface ActionFormRowProps<T = any> {
  icon: Icon;
  title: ReactNode;
  isExpandable?: boolean;
  isMultiLine?: boolean;
  fieldName?: keyof T;
  className?: string;
  children?: ((props: UseToggleReturnType) => ReactNode) | ReactNode;
  tooltips?: {
    label?: TooltipProps;
    content?: TooltipProps;
  };
  isDisabled?: boolean;
}
