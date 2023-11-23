import React, { FC } from 'react';
import Numeral from '~shared/Numeral';
import { useDonutChart } from './hooks';
import { DonutChartProps } from './types';

const displayName = 'v5.common.DonutChart';

const DonutChart: FC<DonutChartProps> = ({
  data,
  hoveredSegment,
  setHoveredSegment,
}) => {
  const {
    tooltipStyle,
    chartRef,
    tooltipRef,
    renderSingleSegment,
    renderMultipleSegments,
    size,
    summedChartValues,
  } = useDonutChart(data, hoveredSegment, setHoveredSegment);

  return (
    <div
      ref={chartRef}
      className="relative w-full h-full"
      style={{ maxWidth: '100%' }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        {data.length === 1 || summedChartValues < 1
          ? renderSingleSegment()
          : renderMultipleSegments()}
      </svg>
      {hoveredSegment && (
        <div
          ref={tooltipRef}
          className="flex items-center justify-center py-2 px-4 text-base-white vertical-align bg-gray-900 rounded-full shadow-lg -mt-2.5"
          style={tooltipStyle}
        >
          <div className="flex items-center justify-center text-xs md:text-sm font-bold text-center">
            <div className="flex-shrink overflow-hidden truncate max-w-[6.25rem] mr-1">
              {hoveredSegment.label}
            </div>
            <div>
              <Numeral
                value={`(${Number(hoveredSegment.value).toFixed(1)}%)`}
              />
            </div>
          </div>
          <div
            className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"
            style={{ boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)' }}
          />
        </div>
      )}
    </div>
  );
};

DonutChart.displayName = displayName;

export default DonutChart;
