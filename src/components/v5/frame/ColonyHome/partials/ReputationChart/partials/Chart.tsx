import { ResponsivePie } from '@nivo/pie';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useReputationChartContext } from '~context/ReputationChartContext/ReputationChartContext.ts';
import { formatText } from '~utils/intl.ts';

import { pieChartConfig } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

import { ChartLoadingLayer } from './ChartLoadingLayer.tsx';
import { ChartTooltip } from './ChartTooltip.tsx';
import Legend from './Legend.tsx';
import LegendItem from './LegendItem.tsx';
import LegendLoadingItem from './LegendLoadingItem.tsx';

const displayName = 'v5.frame.ColonyHome.ReputationChart.partials.Chart';

const MSG = defineMessages({
  noReputationLabel: {
    id: `${displayName}.noReputationLabel`,
    defaultMessage: 'There is no reputation in the colony yet',
  },
});

const EMPTY_CHART_ITEM = {
  id: 'noReputation',
  label: formatText(MSG.noReputationLabel),
  value: 100,
  color: '--color-gray-200',
};

interface ChartProps {
  data: ReputationChartDataItem[];
  isLoading?: boolean;
}

export const Chart: FC<ChartProps> = ({ data, isLoading }) => {
  const { setActiveLegendItem } = useReputationChartContext();
  return (
    <>
      <div className="relative mb-3.5 mt-5 flex h-[136px] w-full flex-shrink-0 items-center justify-center">
        {isLoading ? <ChartLoadingLayer /> : null}
        <ResponsivePie
          {...pieChartConfig}
          data={data.length ? data : [EMPTY_CHART_ITEM]}
          isInteractive={!!data.length}
          onActiveIdChange={setActiveLegendItem}
          tooltip={ChartTooltip}
        />
      </div>

      {isLoading ? (
        <Legend className="grid grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <LegendLoadingItem key={`LoadingLegendItem${index}`} />
          ))}
        </Legend>
      ) : (
        <Legend>
          {!data.length && (
            <LegendItem
              key={EMPTY_CHART_ITEM.id}
              chartItem={{
                id: EMPTY_CHART_ITEM.id,
                label: EMPTY_CHART_ITEM.label,
                color: EMPTY_CHART_ITEM.color,
                shouldTruncateLegendLabel: false,
              }}
            />
          )}

          {!!data.length &&
            data.map((chartItem) => {
              // if there is no value, it's value doesn't display in the chart and therefore it shouldn't display in the legend
              if (chartItem.value === undefined || chartItem.value <= 0) {
                return null;
              }

              return <LegendItem key={chartItem.id} chartItem={chartItem} />;
            })}
        </Legend>
      )}
    </>
  );
};
