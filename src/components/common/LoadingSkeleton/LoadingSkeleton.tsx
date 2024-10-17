import clsx from 'clsx';
import React from 'react';

import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';

import { type LoadingSkeletonProps } from './types.ts';

const displayName = 'LoadingSkeleton';

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  isLoading = false,
  className,
  children,
}) => {
  const { isDarkMode } = usePageThemeContext();

  return isLoading ? (
    <span
      className={clsx(
        'from-neutral-300 to-stone-400 block overflow-hidden skeleton',
        className,
        {
          'skeleton-dark': isDarkMode,
        },
      )}
    />
  ) : (
    <>{children}</>
  );
};

LoadingSkeleton.displayName = displayName;

export default LoadingSkeleton;
