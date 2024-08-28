import React, { type FC } from 'react';
import { Bar } from 'react-chartjs-2';

import { BarChartLoadingLayers } from './BarChartLoadingLayers.tsx';
import { useBarChartConfig } from './hooks.ts';
import { type BarChartDataItem } from './types.ts';

interface BarChartProps {
  data: BarChartDataItem[];
  isLoading?: boolean;
}

export const BarChart: FC<BarChartProps> = ({ isLoading, data }) => {
  const { options, data: formattedData } = useBarChartConfig(data, isLoading);

  return (
    <div className="relative h-48 w-full min-w-72">
      <Bar data={formattedData} options={options as any} height={192} />
      {isLoading && <BarChartLoadingLayers />}
    </div>
  );
};
