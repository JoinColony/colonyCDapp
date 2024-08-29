import { type PieTooltipProps, ResponsivePie } from '@nivo/pie';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';

import { pieChartConfig } from './consts.ts';
import Legend from './partials/Legend.tsx';
import LegendItem from './partials/LegendItem.tsx';
import NoTeamsWithReputation from './partials/NoTeamsWithReputation.tsx';
import { type ReputationChartDataItem } from './types.ts';
import {
  getTeamReputationChartData,
  isThereReputationInDomains,
} from './utils.ts';

const displayName = 'v5.frame.ColonyHome.ReputationChart';

const MSG = defineMessages({
  reputationTitle: {
    id: `${displayName}.influenceTitle`,
    defaultMessage: 'Influence by team',
  },
});

const TemporaryTooltip: FC<PieTooltipProps<ReputationChartDataItem>> = ({
  datum: { label, value },
}) => {
  return (
    <div className="bg-base-black p-2 text-base-white">
      {label}
      (<Numeral value={value.toFixed(1)} />
      %)
    </div>
  );
};

const ReputationChart = () => {
  const {
    colony: { domains },
  } = useColonyContext();

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );
  const chartData = getTeamReputationChartData(allTeams);

  const getChartAndLegend = () => {
    if (chartData.length === 0 || !isThereReputationInDomains(allTeams)) {
      return <NoTeamsWithReputation />;
    }

    return (
      <>
        <div className="mb-5 mt-3 flex h-[140px] w-full flex-shrink-0 items-center justify-center">
          <ResponsivePie
            {...pieChartConfig}
            data={chartData}
            tooltip={TemporaryTooltip}
          />
        </div>
        <Legend>
          {chartData.map((chartItem) => (
            <LegendItem key={chartItem.id} chartItem={chartItem} />
          ))}
        </Legend>
      </>
    );
  };

  return (
    <div className="flex w-full flex-col items-start rounded-lg border px-5 py-6">
      <div className="flex w-full justify-between">
        <h5 className="text-gray-900 heading-5">
          {formatText(MSG.reputationTitle)}
        </h5>
      </div>
      {getChartAndLegend()}
    </div>
  );
};

ReputationChart.displayName = displayName;
export default ReputationChart;
