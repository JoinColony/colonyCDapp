import { ResponsiveBar } from '@nivo/bar';
import React, { type FC } from 'react';

import { cssVariables } from '../consts.ts';
import { useBarChartConfig, useChartYSteps, useData } from '../hooks.ts';
import { type BarChartDataItem } from '../types.ts';
import {
  getFallbackData,
  getFormattedShortAmount,
  getMonthShortName,
} from '../utils.ts';

import { BarChartLoadingLayers } from './BarChartLoadingLayers.tsx';
import { ChartCustomBarGroupLayer } from './ChartCustomBarGroupLayer.tsx';
import { ChartCustomBottomAxisLayer } from './ChartCustomBottomAxisLayer.tsx';
import { ChartCustomXAxisLayer } from './ChartCustomXAxisLayer.tsx';
import { ChartCustomYAxisLayer } from './ChartCustomYAxisLayer.tsx';

interface BarChartProps {}

const EnhancedChartCustomXAxisLayer = (props) => {
  const { loading: isLoading } = useData();

  return (
    <ChartCustomXAxisLayer
      {...props}
      textColor={cssVariables.gray400}
      formatLabel={getMonthShortName}
      isLoading={isLoading}
    />
  );
};

const EnhancedChartCustomYAxisLayer = (props) => {
  const { loading: isLoading } = useData();
  const steps = useChartYSteps();

  return (
    <ChartCustomYAxisLayer
      {...props}
      steps={steps}
      textColor={cssVariables.gray400}
      lineColor={cssVariables.gray200}
      formatLabel={getFormattedShortAmount}
      isLoading={isLoading}
    />
  );
};

const EnhancedChartCustomBarGroupLayer = (props) => {
  const { loading: isLoading } = useData();

  return (
    <ChartCustomBarGroupLayer
      {...props}
      hoveredColor={cssVariables.gray100}
      isLoading={isLoading}
    />
  );
};

export const BarChart: FC<BarChartProps> = () => {
  const barChartConfig = useBarChartConfig<BarChartDataItem>();
  const { timeframe: barChartData, loading: isLoading } = useData();
  const fallbackData = getFallbackData();

  return (
    <div className="relative h-48 w-[312px] min-w-[312px]">
      {isLoading && <BarChartLoadingLayers />}
      <ResponsiveBar
        {...barChartConfig}
        data={!isLoading ? barChartData ?? fallbackData : fallbackData}
        layers={[
          EnhancedChartCustomXAxisLayer,
          EnhancedChartCustomYAxisLayer,
          ChartCustomBottomAxisLayer,
          EnhancedChartCustomBarGroupLayer,
          'bars',
        ]}
      />
    </div>
  );
};
