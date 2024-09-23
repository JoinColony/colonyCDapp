import { type PieTooltipProps } from '@nivo/pie';
import React, { type FC } from 'react';

import { useReputationChartContext } from '~context/ReputationChartContext/ReputationChartContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { ChartCustomTooltip } from '~v5/frame/ColonyHome/partials/ChartCustomTooltip/ChartCustomTooltip.tsx';

import { type ReputationChartDataItem } from '../types.ts';

export const ChartTooltip: FC<PieTooltipProps<ReputationChartDataItem>> = ({
  datum: { id, label, value },
}) => {
  const { setActiveLegendItem, resetActiveLegendItem } =
    useReputationChartContext();

  const onVisibleHandler = (isVisible?: boolean) => {
    if (isVisible && id) {
      setActiveLegendItem(id.toString());
    } else {
      resetActiveLegendItem();
    }
  };

  return (
    <ChartCustomTooltip onVisible={onVisibleHandler}>
      {label}
      <Numeral value={value.toFixed(2)} suffix="%" className="ml-1" />
    </ChartCustomTooltip>
  );
};
