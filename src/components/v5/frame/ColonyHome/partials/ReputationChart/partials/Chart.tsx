import { ResponsivePie } from '@nivo/pie';
import React, { type FC } from 'react';

import { useReputationChartContext } from '~context/ReputationChartContext/ReputationChartContext.ts';

import { pieChartConfig } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

import { ChartCustomArcsLayer } from './ChartCustomArcsLayer.tsx';
import { ChartLoadingLayer } from './ChartLoadingLayer.tsx';
import { ChartTooltip } from './ChartTooltip.tsx';
import Legend from './Legend.tsx';
import LegendItem from './LegendItem.tsx';
import LegendLoadingItem from './LegendLoadingItem.tsx';

interface ChartProps {
  data: ReputationChartDataItem[];
  emptyChartItem: ReputationChartDataItem;
  isLoading?: boolean;
}

export const Chart: FC<ChartProps> = ({ data, emptyChartItem, isLoading }) => {
  const { setActiveLegendItem } = useReputationChartContext();

  return (
    <>
      <div className="relative mb-3.5 mt-5 flex h-[136px] w-full flex-shrink-0 items-center justify-center">
        {isLoading ? <ChartLoadingLayer /> : null}
        <ResponsivePie
          {...pieChartConfig}
          data={data.length ? data : [emptyChartItem]}
          isInteractive={!!data.length}
          onActiveIdChange={setActiveLegendItem}
          tooltip={ChartTooltip}
          layers={[ChartCustomArcsLayer]}
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
              key={emptyChartItem.id}
              chartItem={{
                id: emptyChartItem.id,
                label: emptyChartItem.label,
                color: emptyChartItem.color,
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
