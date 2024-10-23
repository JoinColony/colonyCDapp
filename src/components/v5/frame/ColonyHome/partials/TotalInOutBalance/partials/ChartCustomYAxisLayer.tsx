import { type BarCustomLayerProps } from '@nivo/bar';
import React, { type FC } from 'react';

import { type BarChartDataItem } from '../types.ts';

import { ChartCustomYAxisStep } from './ChartCustomYAxisStep.tsx';

interface ChartCustomYAxisLayerProps
  extends BarCustomLayerProps<BarChartDataItem> {
  textColor: string;
  lineColor: string;
  formatLabel: (value: string | number) => string;
  isLoading?: boolean;
  steps: number[];
}

export const ChartCustomYAxisLayer: FC<ChartCustomYAxisLayerProps> = ({
  innerHeight,
  innerWidth,
  steps,
  textColor,
  lineColor,
  formatLabel,
  isLoading,
}) => {
  return (
    <g transform="translate(0, 0)">
      {/* Render custom Y-axis */}
      {steps.map((tick, index) => {
        const y =
          (innerHeight / (steps.length - 1)) * (steps.length - index - 1);

        return (
          <ChartCustomYAxisStep
            key={tick}
            y={y}
            value={!isLoading ? formatLabel(tick) : ''}
            textColor={textColor}
            lineColor={lineColor}
            width={innerWidth}
          />
        );
      })}
    </g>
  );
};
