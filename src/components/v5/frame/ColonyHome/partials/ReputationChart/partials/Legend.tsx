import clsx from 'clsx';
import React, { type FC } from 'react';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.Legend';
interface LegendProps extends React.HTMLAttributes<HTMLDivElement> {}

const Legend: FC<LegendProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        className,
        'flex w-full flex-row flex-wrap items-end justify-start gap-x-4 gap-y-2',
      )}
    >
      {children}
    </div>
  );
};

Legend.displayName = displayName;
export default Legend;
