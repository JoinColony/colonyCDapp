import { type BarCustomLayerProps } from '@nivo/bar';
import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';
import { type BarChartDataItem } from '../types.ts';

import { ChartCustomXAxisStep } from './ChartCustomXAxisStep.tsx';

interface ChartCustomXAxisLayerProps
  extends BarCustomLayerProps<BarChartDataItem> {
  textColor: string;
  formatLabel: (value: string | number) => string;
  isLoading?: boolean;
}

export const ChartCustomXAxisLayer: FC<ChartCustomXAxisLayerProps> = ({
  xScale,
  innerHeight,
  textColor,
  formatLabel,
  isLoading,
}) => {
  const ticks = xScale.domain().filter((value) => value !== '000'); // Exclude 0 from ticks

  return (
    <g
      transform={`translate(0, ${innerHeight + CHART_CONFIG_VALUES.X_AXIS_TOP_MARGIN})`}
    >
      {/* Render custom Y-axis */}
      {ticks.map((tick) => {
        const x = xScale(tick);

        return (
          <ChartCustomXAxisStep
            key={tick}
            value={!isLoading ? formatLabel(tick) : ''}
            x={x}
            textColor={textColor}
          />
        );
      })}
    </g>
  );
};
