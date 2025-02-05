import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

const displayName = 'frame.LandingPage.partials.ColonyCards';

export const ColonyCardSkeleton = () => (
  <BaseColonyCard
    avatarPlaceholder={
      <LoadingSkeleton isLoading className="h-8 w-8 rounded-full" />
    }
  >
    <div className="flex h-8 w-full items-center justify-between">
      <LoadingSkeleton isLoading className="h-5 w-[7.5rem] rounded" />
      <LoadingSkeleton isLoading className="h-[.6875rem] w-[4.25rem] rounded" />
    </div>
  </BaseColonyCard>
);

ColonyCardSkeleton.displayName = displayName;

export default ColonyCardSkeleton;
