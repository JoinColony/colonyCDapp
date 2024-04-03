import React, { type FC } from 'react';

import Numeral from '~shared/Numeral/index.ts';

import { useDonutChart } from './hooks.tsx';
import { type DonutChartProps } from './types.ts';

const displayName = 'v5.common.DonutChart';

const DonutChart: FC<DonutChartProps> = ({
  data,
  hoveredSegment,
  updateHoveredSegment,
}) => {
  const {
    tooltipStyle,
    chartRef,
    tooltipRef,
    renderSingleSegment,
    renderMultipleSegments,
    size,
    summedChartValues,
  } = useDonutChart({ data, hoveredSegment, updateHoveredSegment });

  return (
    <div ref={chartRef} className="relative h-full w-full max-w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {data.length === 1 || summedChartValues < 1
          ? renderSingleSegment()
          : renderMultipleSegments()}
      </svg>
      {tooltipStyle && (
        <div
          ref={tooltipRef}
          className="vertical-align pointer-events-none absolute -mt-2.5 translate-x-[-50%] translate-y-[-100%] rounded-full bg-gray-900 px-4 py-2 text-base-white shadow-lg"
          style={tooltipStyle}
        >
          <div className="flex items-center justify-center text-center text-xs font-bold md:text-sm">
            <div className="mr-1 max-w-[6.25rem] flex-shrink overflow-hidden truncate">
              {hoveredSegment?.label}
            </div>
            <div>
              <Numeral
                value={`(${Number(hoveredSegment?.value).toFixed(1)}%)`}
              />
            </div>
          </div>
          <div
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 transform bg-gray-900"
            style={{ boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)' }}
          />
        </div>
      )}
    </div>
  );
};

DonutChart.displayName = displayName;

export default DonutChart;
