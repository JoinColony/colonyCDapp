import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

const LabelLoadingSkeleton = () => (
  <LoadingSkeleton isLoading className="h-4 w-5 rounded" />
);
const BarGroupLoadingSkeleton = () => (
  <div className="flex flex-row gap-1">
    <LoadingSkeleton isLoading className="h-1 w-5.5 rounded" />
    <LoadingSkeleton isLoading className="h-1 w-5.5 rounded" />
  </div>
);

export const BarChartLoadingLayers = () => {
  return (
    <>
      {/* Y axis */}
      <div className="absolute left-0.5 top-0 flex h-full w-auto flex-col justify-between pb-4">
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
      </div>
      {/* X axis */}
      <div className="absolute -bottom-0.5 right-0 flex w-full flex-row justify-around pl-10">
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
      </div>
      {/* bars */}
      <div className="absolute bottom-6 right-[3px] flex w-full flex-row justify-around pl-11">
        <BarGroupLoadingSkeleton />
        <BarGroupLoadingSkeleton />
        <BarGroupLoadingSkeleton />
        <BarGroupLoadingSkeleton />
      </div>
    </>
  );
};
