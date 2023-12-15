import { CSSProperties, RefObject } from 'react';

import { ChartData } from '~common/ColonyHome/types';

export interface DonutChartProps {
  data: ChartData[];
  hoveredSegment?: ChartData | null;
  updateHoveredSegment: (data: ChartData | null | undefined) => void;
}

export interface UseDonutChartReturnType {
  tooltipStyle?: CSSProperties;
  chartRef: RefObject<HTMLDivElement>;
  tooltipRef: RefObject<HTMLDivElement>;
  renderSingleSegment: (item?: ChartData) => JSX.Element;
  renderMultipleSegments: () => JSX.Element[];
  size: number;
  summedChartValues: number;
}
