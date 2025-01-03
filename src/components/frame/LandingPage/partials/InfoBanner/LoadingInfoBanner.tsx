import clsx from 'clsx';
import React, { type FC } from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

interface LoadingInfoBannerProps {
  containerClassNames: string;
  contentClassNames: string;
}

const displayName = 'frame.LandingPage.partials.InfoBanner';

const LoadingInfoBanner: FC<LoadingInfoBannerProps> = ({
  containerClassNames,
  contentClassNames,
}) => {
  return (
    <div className={clsx(containerClassNames, 'border-gray-200')}>
      <LoadingSkeleton
        isLoading
        className="h-[1.625rem] w-[7.5rem] rounded-3xl"
      />
      <div className={contentClassNames}>
        <LoadingSkeleton className="h-5 w-5 rounded-3xl" isLoading />
        <LoadingSkeleton className="h-7 w-[7.5rem] rounded" isLoading />
      </div>
      <div>
        <LoadingSkeleton
          className="mb-[.5625rem] h-[.6875rem] w-full rounded"
          isLoading
        />
        <LoadingSkeleton
          className="h-[.6875rem] w-full max-w-[23.3125rem] rounded"
          isLoading
        />
      </div>
    </div>
  );
};

LoadingInfoBanner.displayName = displayName;

export default LoadingInfoBanner;
