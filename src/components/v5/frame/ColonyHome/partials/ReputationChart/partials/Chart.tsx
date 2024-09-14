import { type PieTooltipProps, ResponsivePie } from '@nivo/pie';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';

import { pieChartConfig } from '../consts.ts';
import { type ReputationChartDataItem } from '../types.ts';

import Legend from './Legend.tsx';
import LegendItem from './LegendItem.tsx';

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
}

const TemporaryTooltip: FC<PieTooltipProps<ReputationChartDataItem>> = ({
  datum: { label, value },
}) => {
  return (
    <div className="bg-base-black p-2 text-base-white">
      {label}
      (<Numeral value={value.toFixed(2)} />
      %)
    </div>
  );
};

export const Chart: FC<ChartProps> = ({ data }) => {
  return (
    <>
      <div className="mb-3 mt-5 flex h-[136px] w-full flex-shrink-0 items-center justify-center">
        <ResponsivePie
          {...pieChartConfig}
          data={data.length ? data : [EMPTY_CHART_ITEM]}
          isInteractive={!!data.length}
          tooltip={TemporaryTooltip}
        />
      </div>
      <Legend>
        {!data.length && (
          <LegendItem
            key={EMPTY_CHART_ITEM.id}
            chartItem={{
              label: EMPTY_CHART_ITEM.label,
              color: EMPTY_CHART_ITEM.color,
              value: undefined,
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
    </>
  );
};
