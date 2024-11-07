import { type AxisTickProps } from '@nivo/axes';
import { motion } from 'framer-motion';
import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';

interface ChartCustomBarLabelProps
  extends Pick<AxisTickProps<string>, 'value' | 'textAnchor' | 'textBaseline'> {
  textColor: string;
  shouldTranslateX?: boolean;
  motionProps: {
    from: {
      opacity: number;
      transform: string;
      textTransform: string;
    };
    to: {
      opacity: number;
      transform: string;
      textTransform: string;
    };
    transition: {
      type: string;
      stiffness: number;
      damping: number;
      mass: number;
    };
  };
}

export const ChartCustomBarLabel: FC<ChartCustomBarLabelProps> = ({
  value,
  textAnchor,
  textColor,
  textBaseline,
  shouldTranslateX,
  motionProps,
}) => {
  const { from, to, transition } = motionProps;

  return (
    <motion.g
      initial={{ opacity: from.opacity, transform: from.transform }}
      animate={{ opacity: to.opacity, transform: to.transform }}
      transition={transition}
    >
      <motion.text
        initial={{ opacity: from.opacity, transform: from.textTransform }}
        animate={{ opacity: to.opacity, transform: to.textTransform }}
        transition={transition}
        textAnchor={textAnchor}
        dominantBaseline={textBaseline}
        style={{
          fill: textColor,
          fontSize: CHART_CONFIG_VALUES.FONT_SIZE,
          fontFamily: CHART_CONFIG_VALUES.FONT_FAMILY,
          translate: shouldTranslateX
            ? `${-CHART_CONFIG_VALUES.X_AXIS_LABEL_RIGHT_MARGIN}px`
            : '',
        }}
      >
        {value}
      </motion.text>
    </motion.g>
  );
};
