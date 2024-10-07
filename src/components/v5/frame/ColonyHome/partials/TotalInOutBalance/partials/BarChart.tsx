import { ResponsiveBar } from '@nivo/bar';
import React, { type FC } from 'react';

import { useTotalInOutBalanceChartContext } from '~context/TotalInOutBalanceChartContext/TotalInOutBalanceChartContext.ts';

import { cssVariables } from '../consts.ts';
import { useBarChartConfig } from '../hooks.ts';
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
  const { loading: isLoading } = useTotalInOutBalanceChartContext();

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
  const { ySteps, loading: isLoading } = useTotalInOutBalanceChartContext();

  return (
    <ChartCustomYAxisLayer
      {...props}
      steps={ySteps}
      textColor={cssVariables.gray400}
      lineColor={cssVariables.gray200}
      formatLabel={getFormattedShortAmount}
      isLoading={isLoading}
    />
  );
};

const EnhancedChartCustomBarGroupLayer = (props) => {
  const { loading: isLoading } = useTotalInOutBalanceChartContext();

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
  const { timeframe: barChartData, loading: isLoading } =
    useTotalInOutBalanceChartContext();
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
