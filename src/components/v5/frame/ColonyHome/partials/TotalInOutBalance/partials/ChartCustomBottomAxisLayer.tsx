import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES, cssVariables } from '../consts.ts';

interface ChartCustomBottomAxisLayerProps {
  innerWidth: number;
  innerHeight: number;
}

export const ChartCustomBottomAxisLayer: FC<
  ChartCustomBottomAxisLayerProps
> = ({ innerWidth, innerHeight }) => {
  return (
    <line
      x1={5}
      y1={innerHeight}
      x2={innerWidth}
      y2={innerHeight}
      stroke={cssVariables.gray200} // Color of the border
      strokeWidth={CHART_CONFIG_VALUES.GRID_LINE_WIDTH}
      strokeLinecap="round"
    />
  );
};
