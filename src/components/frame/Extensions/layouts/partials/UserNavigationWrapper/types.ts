import type { ReactNode } from 'react';

export interface UserNavigationWrapperProps {
  txButtons?: ReactNode;
  userHub?: ReactNode;
  extra?: ReactNode;
  isHidden?: boolean;
  className?: string;
}
