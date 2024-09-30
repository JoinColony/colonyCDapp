import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ReputationChartContextProvider } from '~context/ReputationChartContext/ReputationChartContextProvider.tsx';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { type Domain } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';
import { formatText } from '~utils/intl.ts';

import { useContributorsByDomain } from './hooks/useContributorsByDomain.tsx';
import { Chart } from './partials/Chart.tsx';
import ContributorActionsMenu from './partials/ContributorActionsMenu.tsx';
import TeamActionsMenu from './partials/TeamActionsMenu.tsx';
import {
  getContributorReputationChartData,
  getTeamReputationChartData,
  isThereReputationInDomains,
} from './utils.ts';

const hasNoSubDomains = (domain?: Domain) => !!domain && !domain?.isRoot;

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

  const { contributorsList, loading: isContributorsLoading } =
    useContributorsByDomain();

  // @TODO here we should also check if the colony data is loading
  const isDataLoading = isContributorsLoading;

  const selectedDomain = useGetSelectedDomainFilter();

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const chartDataTeams = !isThereReputationInDomains(allTeams)
    ? []
    : getTeamReputationChartData(allTeams);

  const chartDataContributors =
    getContributorReputationChartData(contributorsList);

  // if no subdomains we should show Top Contributors chart instead
  // otherwise it will be a subdomain chart
  const isNoSubDomains = hasNoSubDomains(selectedDomain);
  const chartData = isNoSubDomains ? chartDataContributors : chartDataTeams;
  const reputationTitle = isNoSubDomains
    ? MSG.reputationTitleContributors
    : MSG.reputationTitleTeam;

  const ActionsMenu = isNoSubDomains ? ContributorActionsMenu : TeamActionsMenu;

  return (
    <div className="flex w-full flex-col items-start rounded-lg border px-5 py-6">
      <div className="flex w-full justify-between">
        <LoadingSkeleton
          className="h-6 w-[120px] rounded"
          isLoading={isDataLoading}
        >
          <h5 className="text-gray-900 heading-5">
            {formatText(reputationTitle)}
          </h5>
        </LoadingSkeleton>
        <ActionsMenu isDisabled={isDataLoading} />
      </div>
      <ReputationChartContextProvider>
        <Chart data={chartData} isLoading={isDataLoading} />
      </ReputationChartContextProvider>
    </div>
  );
};

ReputationChart.displayName = displayName;
export default ReputationChart;
