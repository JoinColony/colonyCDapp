import type { ReactNode } from 'react';

export interface UserNavigationWrapperProps {
  txButton?: ReactNode;
  userHub?: ReactNode;
  extra?: ReactNode;
  isHidden?: boolean;
  className?: string;
}
