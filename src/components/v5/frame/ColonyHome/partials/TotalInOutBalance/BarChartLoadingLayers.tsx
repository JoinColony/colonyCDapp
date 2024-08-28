import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';

const LabelLoadingSkeleton = () => (
  <LoadingSkeleton isLoading className="h-4 w-5 rounded" />
);
const BarGroupLoadingSkeleton = () => (
  <div className="flex flex-row gap-1">
    <LoadingSkeleton isLoading className="h-1 w-[23px] rounded" />
    <LoadingSkeleton isLoading className="h-1 w-[23px] rounded" />
  </div>
);

export const BarChartLoadingLayers = () => {
  return (
    <>
      <div className="absolute left-0 top-0 flex h-full w-auto flex-col justify-between pb-5">
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
      </div>
      <div className="absolute bottom-0 flex w-full flex-row justify-around pl-7">
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
        <LabelLoadingSkeleton />
      </div>
      <div className="absolute bottom-[26px] flex w-full flex-row justify-around pl-7">
        <BarGroupLoadingSkeleton />
        <BarGroupLoadingSkeleton />
        <BarGroupLoadingSkeleton />
        <BarGroupLoadingSkeleton />
      </div>
    </>
  );
};
