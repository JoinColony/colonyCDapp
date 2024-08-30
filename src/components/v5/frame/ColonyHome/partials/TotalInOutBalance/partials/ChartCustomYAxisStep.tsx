import { animated, useSpring } from '@react-spring/web';
import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';

import { ChartCustomBarLabel } from './ChartCustomBarLabel.tsx';

interface ChartCustomYAxisStepProps {
  textColor: string;
  lineColor: string;
  y: number;
  value: string;
  width: number;
}

export const ChartCustomYAxisStep: FC<ChartCustomYAxisStepProps> = ({
  textColor,
  lineColor,
  y,
  value,
  width,
}) => {
  const animatedProps = useSpring({
    to: {
      opacity: 1,
      transform: `translate(0, ${y}px)`,
      textTransform: 'scale(1)',
    },
    from: {
      opacity: 0,
      transform: `translate(0, ${y}px)`,
      textTransform: 'scale(0.8)',
    },
    config: { tension: 170, friction: 26 },
  });

  return (
    <>
      <ChartCustomBarLabel
        value={value}
        textColor={textColor}
        animatedProps={animatedProps}
        textAnchor="end"
        textBaseline="middle"
        shouldTranslateX
      />
      <animated.line
        x1={0}
        x2={width}
        y1={y}
        y2={y}
        stroke={lineColor}
        strokeWidth={CHART_CONFIG_VALUES.GRID_LINE_WIDTH}
        strokeDasharray={CHART_CONFIG_VALUES.GRID_LINE_DASHED}
        strokeLinecap="round"
        opacity={animatedProps.opacity}
      />
    </>
  );
};
