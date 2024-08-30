import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';
import { useCssProperties } from '../hooks.ts';

interface ChartCustomBottomAxisLayerProps {
  innerWidth: number;
  innerHeight: number;
}

export const ChartCustomBottomAxisLayer: FC<
  ChartCustomBottomAxisLayerProps
> = ({ innerWidth, innerHeight }) => {
  const cssProperties = useCssProperties();
  return (
    <line
      x1={5}
      y1={innerHeight}
      x2={innerWidth}
      y2={innerHeight}
      stroke={cssProperties.gray200} // Color of the border
      strokeWidth={CHART_CONFIG_VALUES.GRID_LINE_WIDTH}
      strokeLinecap="round"
    />
  );
};
