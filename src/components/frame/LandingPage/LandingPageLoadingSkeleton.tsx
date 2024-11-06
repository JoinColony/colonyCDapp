import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

import ColonyCardSkeleton from './ColonyCards/ColonyCardSkeleton.tsx';
import InfoBanner from './InfoBanner/InfoBanner.tsx';

const displayName = 'frame.LandingPage';

interface LandingPageLoadingSkeletonProps {
  loadingCards: boolean;
}

const LandingPageLoadingSkeleton = ({
  loadingCards = false,
}: LandingPageLoadingSkeletonProps) => {
  return loadingCards ? (
    <div className="flex h-full w-full items-end px-6 pb-8 md:px-0 md:pb-[3.125rem]">
      <div className="mt-3 flex h-full w-full flex-col justify-between">
        <div className="flex h-full w-full flex-col justify-end">
          <LoadingSkeleton
            isLoading
            className="rounded-4 mb-3 h-[2.375rem] w-full max-w-[25rem]"
          />
          <LoadingSkeleton
            isLoading
            className="rounded-4 mb-[1.625rem] h-5 w-full max-w-[20.0625rem]"
          />
          <LoadingSkeleton
            isLoading
            className="rounded-4 mb-4 h-[.6875rem] w-full max-w-[5.625rem]"
          />
          <div className="mb-4 flex flex-col gap-4 md:min-h-[28.125rem]">
            <ColonyCardSkeleton />
            <ColonyCardSkeleton />
            <ColonyCardSkeleton />
            <ColonyCardSkeleton />
          </div>
        </div>
        <div className="w-full">
          <LoadingSkeleton
            isLoading
            className="rounded-4 h-[2.125rem] w-full"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex h-full w-full items-center px-6 pb-8 md:px-0 md:pb-[3.125rem]">
      <div className="mt-3 flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-col justify-center">
          <LoadingSkeleton
            isLoading
            className="rounded-4 mb-3 h-[2.375rem] w-full max-w-[25rem]"
          />
          <LoadingSkeleton
            isLoading
            className="rounded-4 mb-8 h-5 w-full max-w-[20.0625rem]"
          />
          <div className="mb-8">
            <InfoBanner text="" title="" loading />
          </div>
          <LoadingSkeleton
            isLoading
            className="rounded-4 h-[2.125rem] w-full"
          />
        </div>
      </div>
    </div>
  );
};

LandingPageLoadingSkeleton.displayName = displayName;

export default LandingPageLoadingSkeleton;
