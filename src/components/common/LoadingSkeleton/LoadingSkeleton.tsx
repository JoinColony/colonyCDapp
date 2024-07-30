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
    <div className={clsx('overflow-hidden skeleton', className)} />
  ) : (
    <>{children}</>
  );

LoadingSkeleton.displayName = displayName;

export default LoadingSkeleton;
