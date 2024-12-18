import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

const displayName =
  'v5.frame.ColonyHome.ReputationChart.partials.LegendLoadingItem';

const LegendLoadingItem = () => {
  return (
    <div className="flex grow flex-row items-center gap-1 pr-0.5">
      <LoadingSkeleton className="h-2.5 w-2.5 rounded-full" isLoading />
      <LoadingSkeleton className="h-4 min-w-8 grow rounded" isLoading />
      <LoadingSkeleton className="h-4 w-5 rounded" isLoading />
    </div>
  );
};

LegendLoadingItem.displayName = displayName;
export default LegendLoadingItem;
