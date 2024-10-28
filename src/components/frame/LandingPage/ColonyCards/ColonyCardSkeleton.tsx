import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

import BaseColonyCard from './BaseColonyCard/BaseColonyCard.tsx';

const displayName = 'frame.LandingPage.ColonyCards';

export const ColonyCardSkeleton = () => (
  <BaseColonyCard
    avatarPlaceholder={
      <LoadingSkeleton isLoading className="h-8 w-8 rounded-full" />
    }
  >
    <div className="flex flex-1 flex-col gap-1">
      <LoadingSkeleton isLoading className="h-5 w-[7.5rem] rounded" />
    </div>
  </BaseColonyCard>
);

ColonyCardSkeleton.displayName = displayName;

export default ColonyCardSkeleton;
