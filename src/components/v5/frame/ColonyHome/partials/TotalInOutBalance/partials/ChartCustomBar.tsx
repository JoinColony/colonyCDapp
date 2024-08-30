import { useTooltip } from '@nivo/tooltip';
import React, { type FC } from 'react';

import { currencySymbolMap } from '~constants/currency.ts';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';

import { CHART_CONFIG_VALUES } from '../consts.ts';
import { type BarItem } from '../types.ts';
import { getFormattedFullAmount } from '../utils.ts';

import { ChartCustomTooltip } from './ChartCustomTooltip.tsx';

interface ChartCustomBarProps {
  bar: BarItem;
  innerHeight: number;
  onMouseEnter: any;
  onMouseLeave: any;
  isLoading?: boolean;
}

export const ChartCustomBar: FC<ChartCustomBarProps> = ({
  bar: { x, y, height, color, data },
  innerHeight,
  onMouseEnter,
  onMouseLeave,
  isLoading,
}) => {
  const { showTooltipFromEvent, hideTooltip } = useTooltip();
  const { currency } = useCurrencyContext();
  const customWidth = CHART_CONFIG_VALUES.BAR_WIDTH;
  const customMinHeight = CHART_CONFIG_VALUES.BAR_MIN_HEIGHT;
  let customHeight = height;
  let customY = data.value ? y : innerHeight;

  if (height === 0) {
    // nivo.rocks introduces an item with label '000' upon loading, so we don't want to end up displaying it
    customHeight = data.indexValue === '000' || isLoading ? 0 : customMinHeight;
    customY = innerHeight - customMinHeight;
  }

  const mouseInteractionHandler = (event) => {
    showTooltipFromEvent(
      <ChartCustomTooltip>
        {getFormattedFullAmount(data?.value, currencySymbolMap[currency])}
      </ChartCustomTooltip>,
      event,
    );

    onMouseEnter(data.indexValue);
  };

  const toggleTooltipHandler = (event) => {
    mouseInteractionHandler(event);
  };

  return (
    <g
      transform={`translate(${x}, ${customY})`}
      onClick={toggleTooltipHandler}
      onMouseEnter={mouseInteractionHandler}
      onMouseMove={mouseInteractionHandler}
      onMouseLeave={() => {
        hideTooltip();
        onMouseLeave();
      }}
    >
      <rect
        x={0}
        y={CHART_CONFIG_VALUES.BAR_Y_OFFSET}
        width={customWidth}
        height={customHeight}
        fill={color}
        rx={CHART_CONFIG_VALUES.BORDER_RADIUS}
        ry={CHART_CONFIG_VALUES.BORDER_RADIUS}
      />
    </g>
  );
};
