import { motion } from 'framer-motion';
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
  const motionProps = {
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
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 26,
      mass: 1,
    },
  };

  return (
    <>
      <ChartCustomBarLabel
        value={value}
        textColor={textColor}
        textAnchor="end"
        textBaseline="middle"
        shouldTranslateX
        motionProps={motionProps}
      />
      <motion.line
        x1={0}
        x2={width}
        y1={y}
        y2={y}
        stroke={lineColor}
        strokeWidth={CHART_CONFIG_VALUES.GRID_LINE_WIDTH}
        strokeDasharray={CHART_CONFIG_VALUES.GRID_LINE_DASHED}
        strokeLinecap="round"
        initial={{ opacity: 0, transform: `translate(0, ${y}px) scale(0.8)` }}
        animate={{ opacity: 1, transform: `translate(0, ${y}px) scale(1)` }}
        transition={{ duration: 0.5 }}
      />
    </>
  );
};
