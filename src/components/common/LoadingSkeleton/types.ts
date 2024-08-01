import { type PropsWithChildren } from 'react';

export interface LoadingSkeletonProps extends PropsWithChildren {
  isLoading?: boolean;
  className?: string;
}
