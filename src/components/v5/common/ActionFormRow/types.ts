import React from 'react';
import { UseToggleReturnType } from '~hooks/useToggle/types';

export interface ActionFormRowProps {
  iconName: string;
  title: React.ReactNode;
  isExpandable?: boolean;
  fieldName?: string;
  children?:
    | ((props: UseToggleReturnType) => React.ReactNode)
    | React.ReactNode;
}
