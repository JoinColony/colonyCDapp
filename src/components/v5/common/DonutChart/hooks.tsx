import clsx from 'clsx';
import React, {
  useState,
  useRef,
  CSSProperties,
  TouchEvent,
  useCallback,
  useMemo,
} from 'react';

import { ChartData } from '~common/ColonyHome/types';

import { UseDonutChartReturnType } from './types';

export const useDonutChart = (
  data,
  hoveredSegment,
  setHoveredSegment,
): UseDonutChartReturnType => {
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
              color: '--color-base-bg',
              stroke: '--color-base-white',
            },
          ],
    [data, summedChartValues],
  );

  const totalValue = chartData.reduce((acc, item) => acc + item.value, 0);

  const polarToCartesian = useCallback(
    (
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number,
    ) => {
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
      const startOuter = polarToCartesian(
        outerRadius,
        outerRadius,
        outerRadius,
        startAngle,
      );
      const endOuter = polarToCartesian(
        outerRadius,
        outerRadius,
        outerRadius,
        startAngle + angle,
      );
      const startInner = polarToCartesian(
        outerRadius,
        outerRadius,
        innerRadius,
        startAngle,
      );
      const endInner = polarToCartesian(
        outerRadius,
        outerRadius,
        innerRadius,
        startAngle + angle,
      );

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
    (event, item?: ChartData | null) => {
      const tooltipWidth = tooltipRef.current
        ? tooltipRef.current.offsetWidth
        : 0;
      const tooltipHeight = tooltipRef.current
        ? tooltipRef.current.offsetHeight
        : 0;

      // Adjust the left and top values to prevent the tooltip from going off screen
      const left =
        chartRef.current !== null &&
        Math.min(
          chartRef.current.offsetWidth - tooltipWidth / 2,
          event.clientX - tooltipWidth / 2,
          event.clientX -
            chartRef.current.getBoundingClientRect().left -
            tooltipWidth / 2,
        );

      const top =
        chartRef.current !== null &&
        event.clientY -
          chartRef.current.getBoundingClientRect().top -
          tooltipHeight -
          10;

      if (item) {
        setHoveredSegment(item);
      }
      setTooltipStyle({
        display: 'block',
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        pointerEvents: 'none',
        zIndex: 10,
        transform: `translate(-50%, -100%) translate(${
          event.offsetX - size / 2
        }px, ${event.offsetY - size / 2}px)`, // Center the tooltip above the cursor
      });
    },
    [setHoveredSegment],
  );

  const handleTouch = useCallback(
    (event: TouchEvent, item?: ChartData | null) => {
      const touchLocation = event.touches[0];
      handleMouseOver(touchLocation, item);
    },
    [handleMouseOver],
  );

  const renderSingleSegment = (item: ChartData) => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius - donutWidth;

    return (
      <g
        onMouseOver={(event) => handleMouseOver(event, item)}
        onMouseMove={(event) => handleMouseOver(event, hoveredSegment)}
        onMouseOut={() => setHoveredSegment(null)}
        onTouchStart={(event) => handleTouch(event, item)}
        onTouchMove={(event) => handleTouch(event, hoveredSegment)}
        onTouchEnd={() => setHoveredSegment(null)}
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
          fill="white" // Assuming the center should be white
        />
      </g>
    );
  };

  const getTooltipPosition = useCallback(
    (value: number, total: number, index: number) => {
      const angle = (value / total) * 360;
      const startAngle =
        index === 0
          ? 0
          : chartData
              .slice(0, index)
              .reduce((acc, item) => acc + (item.value / total) * 360, 0);
      const middleAngle = startAngle + angle / 2;
      const radius = size / 4; // Positioning tooltip in the middle of the donut width
      const position = polarToCartesian(
        size / 2,
        size / 2,
        radius,
        middleAngle,
      );

      return {
        left: position.x,
        top: position.y,
      };
    },
    [chartData, polarToCartesian],
  );

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
          onMouseOut={() => setHoveredSegment(null)}
          onTouchStart={(event) => handleTouch(event, item)}
          onTouchMove={(event) => handleTouch(event, item)}
          onTouchEnd={() => setHoveredSegment(null)}
        >
          <path
            key={`segment-${item.id}`}
            d={path}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={3}
            onMouseEnter={() => {
              setHoveredSegment(item);
              setTooltipStyle(
                getTooltipPosition(item.value, totalValue, index),
              );
            }}
            onMouseLeave={() => setHoveredSegment(null)}
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
    calculatePath,
    chartData,
    getTooltipPosition,
    handleMouseOver,
    handleTouch,
    hoveredSegment,
    setHoveredSegment,
    totalValue,
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
