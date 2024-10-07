import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useTotalInOutBalanceChartContext } from '~context/TotalInOutBalanceChartContext/TotalInOutBalanceChartContext.ts';

import { useBarChartLegend } from '../hooks.ts';

export const BarChartLegend = () => {
  const legend = useBarChartLegend();
  const { loading: isLoading } = useTotalInOutBalanceChartContext();

  return (
    <div className="flex gap-3">
      {legend.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <LoadingSkeleton
            className="h-2.5 w-2.5 rounded-full"
            isLoading={isLoading}
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          </LoadingSkeleton>

          <LoadingSkeleton className="h-4 w-5 rounded" isLoading={isLoading}>
            <p className="text-xs font-normal text-gray-500">{item.label}</p>
          </LoadingSkeleton>
        </div>
      ))}
    </div>
  );
};
