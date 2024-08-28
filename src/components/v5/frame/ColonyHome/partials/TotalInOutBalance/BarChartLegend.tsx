import React from 'react';

import { useBarChartLegend } from './hooks.ts';

export const BarChartLegend = () => {
  const legend = useBarChartLegend();
  return (
    <div className="flex gap-3">
      {legend.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <p className="text-xs font-normal text-gray-600">{item.label}</p>
        </div>
      ))}
    </div>
  );
};
