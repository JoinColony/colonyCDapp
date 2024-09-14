import React from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMembersPage } from '~frame/v5/pages/MembersPage/hooks.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';

import { Chart } from './partials/Chart.tsx';
import {
  getContributorReputationChartData,
  getTeamReputationChartData,
  isThereReputationInDomains,
} from './utils.ts';

const displayName = 'v5.frame.ColonyHome.ReputationChart';

const MSG = defineMessages({
  reputationTitleTeam: {
    id: `${displayName}.influenceTitleTeam`,
    defaultMessage: 'Influence by team',
  },
  reputationTitleContributors: {
    id: `${displayName}.influenceTitleContributors`,
    defaultMessage: 'Top contributors',
  },
});

const ReputationChart = () => {
  const {
    colony: { domains },
  } = useColonyContext();

  const { contributorsList } = useMembersPage();

  const selectedDomain = useGetSelectedDomainFilter();

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const allContributors = (contributorsList || [])
    .filter((item: any) => {
      return item !== null && !!item.reputation;
    })
    .sort((a, b) => Number(b.reputation) - Number(a.reputation));

  const chartDataTeams = !isThereReputationInDomains(allTeams)
    ? []
    : getTeamReputationChartData(allTeams);

  const chartDataContributors =
    getContributorReputationChartData(allContributors);

  // if domain/team is selected we should show Top Contributors chart instead
  const chartData = selectedDomain ? chartDataContributors : chartDataTeams;
  const reputationTitle = selectedDomain
    ? MSG.reputationTitleContributors
    : MSG.reputationTitleTeam;

  return (
    <div className="flex w-full flex-col items-start rounded-lg border px-5 py-6">
      <div className="flex w-full justify-between">
        <h5 className="text-gray-900 heading-5">
          {formatText(reputationTitle)}
        </h5>
      </div>
      <Chart data={chartData} />
    </div>
  );
};

ReputationChart.displayName = displayName;
export default ReputationChart;
