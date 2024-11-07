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
  const motionProps = {
    from: {
      opacity: 0,
      transform: `translate(${x + CHART_CONFIG_VALUES.MARGIN_BOTTOM}px, 0) scale(0.8)`,
      textTransform: 'scale(0.8)',
    },
    to: {
      opacity: 1,
      transform: `translate(${x + CHART_CONFIG_VALUES.MARGIN_BOTTOM}px, 0) scale(1)`,
      textTransform: 'scale(1)',
    },
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 26,
      mass: 1,
    },
  };

  return (
    <ChartCustomBarLabel
      value={value}
      textColor={textColor}
      textAnchor="middle"
      textBaseline="hanging"
      motionProps={motionProps}
    />
  );
};
