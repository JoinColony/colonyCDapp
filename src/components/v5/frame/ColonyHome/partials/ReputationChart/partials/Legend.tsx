import React, { type FC, type PropsWithChildren } from 'react';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.Legend';
interface LegendProps extends PropsWithChildren {}

const Legend: FC<LegendProps> = ({ children }) => {
  return (
    <div className="flex w-full flex-row flex-wrap items-end justify-start gap-x-4 gap-y-2">
      {children}
    </div>
  );
};

Legend.displayName = displayName;
export default Legend;
