import { type PieTooltipProps } from '@nivo/pie';
import React, { type FC } from 'react';

import Numeral from '~shared/Numeral/Numeral.tsx';
import { ChartCustomTooltip } from '~v5/frame/ColonyHome/partials/ChartCustomTooltip/ChartCustomTooltip.tsx';

import { type ReputationChartDataItem } from '../types.ts';

export const ChartTooltip: FC<PieTooltipProps<ReputationChartDataItem>> = ({
  datum: { label, value },
}) => {
  return (
    <ChartCustomTooltip>
      {label}
      <Numeral value={value.toFixed(2)} suffix="%" className="ml-1" />
    </ChartCustomTooltip>
  );
};
