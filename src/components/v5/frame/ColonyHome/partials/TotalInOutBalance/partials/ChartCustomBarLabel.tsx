import { type AxisTickProps } from '@nivo/axes';
import { animated } from '@react-spring/web';
import React, { type FC } from 'react';

import { CHART_CONFIG_VALUES } from '../consts.ts';

interface ChartCustomBarLabelProps
  extends Pick<
    AxisTickProps<string>,
    'value' | 'textAnchor' | 'textBaseline' | 'animatedProps'
  > {
  textColor: string;
  shouldTranslateX?: boolean;
}

export const ChartCustomBarLabel: FC<ChartCustomBarLabelProps> = ({
  value,
  textAnchor,
  textColor,
  textBaseline,
  animatedProps,
  shouldTranslateX,
}) => {
  return (
    <animated.g style={{ transform: animatedProps.transform }}>
      <animated.text
        opacity={animatedProps.opacity}
        transform={animatedProps.textTransform}
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
      </animated.text>
    </animated.g>
  );
};
