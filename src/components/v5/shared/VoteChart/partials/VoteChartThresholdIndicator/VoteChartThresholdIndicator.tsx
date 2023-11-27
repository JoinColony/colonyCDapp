import React, { FC } from 'react';

const displayName = 'v5.VoteChart.partials.VoteChartThresholdIndicator';

const VoteChartThresholdIndicator: FC = () => (
  <div
    className={`
      pt-[.375rem]
      flex
      justify-center
      h-[calc(100%+0.375rem)]
      -mt-[.375rem]
      relative
      before:border-4
      before:border-transparent
      before:border-t-blue-400
      before:absolute
      before:left-1/2
      before:-top-0
      before:-translate-x-1/2
    `}
  >
    <div
      className={`
        h-full
        w-[.125rem]
        bg-blue-400
      `}
    />
  </div>
);

VoteChartThresholdIndicator.displayName = displayName;

export default VoteChartThresholdIndicator;
