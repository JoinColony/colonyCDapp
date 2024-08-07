import clsx from 'clsx';
import React, {
  useState,
  useRef,
  type CSSProperties,
  type TouchEvent,
  useCallback,
  useMemo,
} from 'react';

import {
  type ChartData,
  type DonutChartProps,
  type UseDonutChartReturnType,
} from './types.ts';

export const useDonutChart = ({
  data,
  hoveredSegment,
  updateHoveredSegment,
}: DonutChartProps): UseDonutChartReturnType => {
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties | undefined>();
  const chartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const size = 200; // The size of the SVG
  const donutWidth = 25; // The width of the donut ring

  const summedChartValues: number = data.reduce(
    (acc, item) => acc + item.value,
    0,
  );

  // Check if data is empty and set a default segment if it is
  const chartData: ChartData[] = useMemo(
    () =>
      data.length > 0 && summedChartValues > 1
        ? data
        : [
            {
              id: '1',
              label: '',
              value: 100,
              color: '--color-gray-100',
              stroke: '--color-base-white',
            },
          ],
    [data, summedChartValues],
  );

  const totalValue = chartData.reduce((acc, item) => acc + item.value, 0);

  const polarToCartesian = useCallback(
    ({
      centerX,
      centerY,
      radius,
      angleInDegrees,
    }: {
      centerX: number;
      centerY: number;
      radius: number;
      angleInDegrees: number;
    }) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    },
    [],
  );

  const calculatePath = useCallback(
    (value: number, total: number, index: number): string => {
      const angle = (value / total) * 360;
      const startAngle =
        index === 0
          ? 0
          : chartData
              .slice(0, index)
              .reduce((acc, item) => acc + (item.value / total) * 360, 0);
      const largeArcFlag = angle > 180 ? 1 : 0;
      const outerRadius = size / 2;
      const innerRadius = outerRadius - donutWidth;
      const startOuter = polarToCartesian({
        centerX: outerRadius,
        centerY: outerRadius,
        radius: outerRadius,
        angleInDegrees: startAngle,
      });
      const endOuter = polarToCartesian({
        centerX: outerRadius,
        centerY: outerRadius,
        radius: outerRadius,
        angleInDegrees: startAngle + angle,
      });
      const startInner = polarToCartesian({
        centerX: outerRadius,
        centerY: outerRadius,
        radius: innerRadius,
        angleInDegrees: startAngle,
      });
      const endInner = polarToCartesian({
        centerX: outerRadius,
        centerY: outerRadius,
        radius: innerRadius,
        angleInDegrees: startAngle + angle,
      });

      return [
        'M',
        startOuter.x,
        startOuter.y,
        'A',
        outerRadius,
        outerRadius,
        0,
        largeArcFlag,
        1,
        endOuter.x,
        endOuter.y,
        'L',
        endInner.x,
        endInner.y,
        'A',
        innerRadius,
        innerRadius,
        0,
        largeArcFlag,
        0,
        startInner.x,
        startInner.y,
        'Z',
      ].join(' ');
    },
    [chartData, polarToCartesian],
  );

  const handleMouseOver = useCallback(
    (event: React.MouseEvent | React.Touch, item?: ChartData | null) => {
      if (item) {
        updateHoveredSegment(item);
      }

      /**
       * Set the tooltip position to the mouse position relative to the chart
       */
      const { left: chartLeft = 0, top: chartTop = 0 } =
        chartRef.current?.getBoundingClientRect() ?? {};
      const left = event.clientX - chartLeft;
      const top = event.clientY - chartTop;

      setTooltipStyle({
        left: `${left}px`,
        top: `${top}px`,
      });
    },
    [updateHoveredSegment],
  );

  const handleTouch = useCallback(
    (event: TouchEvent, item?: ChartData | null) => {
      const touchLocation = event.touches[0];
      handleMouseOver(touchLocation, item);
    },
    [handleMouseOver],
  );

  const handleSegmentMouseLeave = useCallback(() => {
    updateHoveredSegment(null);
    setTooltipStyle(undefined);
  }, [updateHoveredSegment]);

  const renderSingleSegment = (item: ChartData) => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius - donutWidth;

    return (
      <g
        onMouseOver={(event) => handleMouseOver(event, item)}
        onMouseMove={(event) => handleMouseOver(event, hoveredSegment)}
        onMouseOut={handleSegmentMouseLeave}
        onTouchStart={(event) => handleTouch(event, item)}
        onTouchMove={(event) => handleTouch(event, hoveredSegment)}
        onTouchEnd={handleSegmentMouseLeave}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={outerRadius}
          fill={`var(${chartData[0].color}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={innerRadius}
          fill="var(--color-base-white)" // Assuming the center should be white
        />
      </g>
    );
  };

  const renderMultipleSegments = useCallback(() => {
    return chartData.map((item, index) => {
      // Calculate the path for this segment
      const path = calculatePath(item.value, totalValue, index);
      const fillColor = `var(${item.color})`;
      const strokeColor = `var(--color-base-white)`;

      return (
        <g
          key={item.id}
          onMouseOver={(event) => handleMouseOver(event, item)}
          onMouseMove={(event) => handleMouseOver(event, item)}
          onMouseOut={handleSegmentMouseLeave}
          onTouchStart={(event) => handleTouch(event, item)}
          onTouchMove={(event) => handleTouch(event, item)}
          onTouchEnd={handleSegmentMouseLeave}
        >
          <path
            key={`segment-${item.id}`}
            d={path}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={3}
            className={clsx(
              'cursor-pointer transition-opacity duration-300 ease-in-out',
              {
                'opacity-75': hoveredSegment?.id === item?.id,
                'opacity-100': hoveredSegment?.id !== item?.id,
              },
            )}
          />
        </g>
      );
    });
  }, [
    chartData,
    calculatePath,
    totalValue,
    handleSegmentMouseLeave,
    hoveredSegment?.id,
    handleMouseOver,
    handleTouch,
  ]);

  return {
    tooltipStyle,
    chartRef,
    tooltipRef,
    renderSingleSegment,
    renderMultipleSegments,
    size,
    summedChartValues,
  };
};
