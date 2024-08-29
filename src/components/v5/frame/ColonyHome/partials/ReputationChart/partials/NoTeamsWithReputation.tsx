import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { pieChartConfig } from '../consts.ts';

import Legend from './Legend.tsx';
import LegendItem from './LegendItem.tsx';

const displayName =
  'v5.frame.ColonyHome.ReputationChart.partials.NoTeamsWithReputation';

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

const NoTeamsWithReputation: FC = () => {
  return (
    <>
      <div className="mb-5 mt-3 flex h-[140px] w-full flex-shrink-0 items-center justify-center">
        <ResponsivePie
          {...pieChartConfig}
          data={[EMPTY_CHART_ITEM]}
          isInteractive={false}
        />
      </div>
      <Legend>
        <LegendItem
          key={EMPTY_CHART_ITEM.id}
          chartItem={{
            label: EMPTY_CHART_ITEM.label,
            color: EMPTY_CHART_ITEM.color,
            value: undefined,
          }}
        />
      </Legend>
    </>
  );
};

NoTeamsWithReputation.displayName = displayName;
export default NoTeamsWithReputation;
