import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

import ColonyCardSkeleton from '../ColonyCards/ColonyCardSkeleton.tsx';
import InfoBanner from '../InfoBanner/InfoBanner.tsx';

const displayName = 'frame.LandingPage.partials.LandingPageLoadingSkeleton';

interface LandingPageLoadingSkeletonProps {
  loadingCards: boolean;
}

const LandingPageLoadingSkeleton = ({
  loadingCards = false,
}: LandingPageLoadingSkeletonProps) => {
  return loadingCards ? (
    <div className="h-full w-full px-6 pb-8 pt-[1.625rem] md:px-0 md:pb-[3.125rem] md:pt-0">
      <div className="flex flex-col justify-end md:h-full">
        <div className="flex w-full flex-col justify-end md:h-full md:max-h-[calc(100%-126px)]">
          <LoadingSkeleton
            isLoading
            className="mb-3 h-[2.375rem] w-full max-w-[25rem] rounded"
          />
          <LoadingSkeleton
            isLoading
            className="mb-[1.625rem] h-5 w-full max-w-[20.0625rem] rounded"
          />
          <LoadingSkeleton
            isLoading
            className="mb-4 h-[.6875rem] w-full max-w-[5.625rem] rounded"
          />
          <div className="mb-4 flex flex-col gap-4 md:min-h-[28.125rem]">
            <ColonyCardSkeleton />
            <ColonyCardSkeleton />
            <ColonyCardSkeleton />
            <ColonyCardSkeleton />
          </div>
        </div>
        <div className="hidden w-full md:block">
          <LoadingSkeleton isLoading className="h-[2.125rem] w-full rounded" />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex h-full w-full items-center px-6 pb-8 md:px-0 md:pb-[3.125rem]">
      <div className="mt-3 flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-col justify-center">
          <LoadingSkeleton
            isLoading
            className="mb-3 h-[2.375rem] w-full max-w-[25rem] rounded"
          />
          <LoadingSkeleton
            isLoading
            className="mb-8 h-5 w-full max-w-[20.0625rem] rounded"
          />
          <div className="mb-8">
            <InfoBanner text="" title="" loading />
          </div>
          <LoadingSkeleton isLoading className="h-[2.125rem] w-full rounded" />
        </div>
      </div>
    </div>
  );
};

LandingPageLoadingSkeleton.displayName = displayName;

export default LandingPageLoadingSkeleton;
