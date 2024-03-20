import React, { type FC } from 'react';

const displayName = 'v5.VoteChart.partials.VoteChartThresholdIndicator';

const VoteChartThresholdIndicator: FC = () => (
  <div
    className={`
      relative
      -mt-[.375rem]
      flex
      h-[calc(100%+0.375rem)]
      justify-center
      pt-[.375rem]
      before:absolute
      before:-top-0
      before:left-1/2
      before:-translate-x-1/2
      before:border-4
      before:border-transparent
      before:border-t-blue-400
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
