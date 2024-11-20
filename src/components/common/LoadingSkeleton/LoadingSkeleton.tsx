import clsx from 'clsx';
import React from 'react';

import { type LoadingSkeletonProps } from './types.ts';

const displayName = 'LoadingSkeleton';

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  isLoading = false,
  className,
  children,
}) =>
  isLoading ? (
    <span
      className={clsx('block overflow-hidden skeleton', className)}
      data-testid="loading-skeleton"
    />
  ) : (
    <>{children}</>
  );
LoadingSkeleton.displayName = displayName;

export default LoadingSkeleton;
