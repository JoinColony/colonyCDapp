import { useSpring } from '@react-spring/web';
import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';

import { ChartCustomBarLabel } from './ChartCustomBarLabel.tsx';

interface ChartCustomXAxisStepProps {
  x: number;
  value: string;
  textColor: string;
}

export const ChartCustomXAxisStep: FC<ChartCustomXAxisStepProps> = ({
  x,
  value,
  textColor,
}) => {
  const animatedProps = useSpring({
    to: {
      opacity: 1,
      transform: `translate(${x + CHART_CONFIG_VALUES.MARGIN_BOTTOM}px, 0)`,
      textTransform: 'scale(1)',
    },
    from: {
      opacity: 0,
      transform: `translate(${x + CHART_CONFIG_VALUES.MARGIN_BOTTOM}px, 0)`,
      textTransform: 'scale(0.8)',
    },
    config: { tension: 170, friction: 26 },
  });

  return (
    <ChartCustomBarLabel
      value={value}
      textColor={textColor}
      animatedProps={animatedProps}
      textAnchor="middle"
      textBaseline="hanging"
    />
  );
};
