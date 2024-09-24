import { Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { type Domain } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { adjustPercentagesTo100 } from '~utils/numbers.ts';
import { getTeamHexColor } from '~utils/teams.ts';

import { CONTRIBUTORS_COLORS_LIST } from './consts.ts';
import { type ContributorItem, type ReputationChartDataItem } from './types.ts';

const WIDGET_TEAM_LIMIT = 4;

const MSG = defineMessages({
  otherLabel: {
    id: `v5.frame.ColonyHome.ReputationChart.otherLabel`,
    defaultMessage: 'All other',
  },
});

export const isThereReputationInDomains = (colonyDomains: Domain[]) => {
  return colonyDomains.some(
    (domain) => Number(domain.reputationPercentage || 0) > 0,
  );
};

export const getNormalisedDomainReputationPercentage = (
  domain: Domain,
  normalisedTotalReputation: number,
) => (Number(domain.reputation || 0) * 100) / normalisedTotalReputation;

export const getTeamReputationChartData = (
  allTeams: Domain[],
): ReputationChartDataItem[] => {
  const rootTeam = allTeams.find(({ nativeId }) => nativeId === Id.RootDomain);
  const domainsWithoutRoot = allTeams.filter(
    ({ nativeId }) => nativeId !== Id.RootDomain,
  );

  /**
   * If only root has reputation, we display only the root team
   */
  if (
    rootTeam &&
    !isThereReputationInDomains(domainsWithoutRoot) &&
    Number(rootTeam?.reputationPercentage || 0) > 0
  ) {
    return [
      {
        id: rootTeam.id,
        label: rootTeam.metadata?.name || '',
        value: 100,
        color: getTeamHexColor(rootTeam.metadata?.color),
      },
    ];
  }

  /**
   * Exclude the General team reputation from the domain reputation percentage computation
   */
  const normalisedTotalReputation = domainsWithoutRoot.reduce(
    (reputation, team) => reputation + Number(team.reputation || 0),
    0,
  );

  let topTeams: ReputationChartDataItem[] = domainsWithoutRoot
    // Filter out the domains without reputation in order to not display blank spaces in the chart
    .filter((domain) => !!domain.reputationPercentage)
    .slice(0, WIDGET_TEAM_LIMIT)
    .map((domain) => {
      return {
        id: domain.id,
        label: domain.metadata?.name || '',
        value: getNormalisedDomainReputationPercentage(
          domain,
          normalisedTotalReputation,
        ),
        color: getTeamHexColor(domain.metadata?.color),
      };
    });

  const topTeamsTotalReputation = topTeams.reduce(
    (reputation, team) => reputation + team.value,
    0,
  );

  /**
   * To reach the 100% reputation percentage, we exclude the top teams reputation from 100%
   */
  const reputationInOtherTeams = 100 - topTeamsTotalReputation;

  if (reputationInOtherTeams > 0) {
    topTeams.push({
      id: 'allOtherTeams',
      label: formatText(MSG.otherLabel),
      value: reputationInOtherTeams,
      color: '--color-gray-400',
      shouldTruncateLegendLabel: false,
    });
  }

  const adjustedValues = adjustPercentagesTo100(
    topTeams.map((team) => team.value),
    // We are rounding to 2 decimals everywhere
    2,
  );
  topTeams = topTeams.map((team, idx) => ({
    ...team,
    value: adjustedValues[idx],
  }));

  return topTeams;
};

export const getContributorReputationChartData = (
  contributorsList: ContributorItem[],
): ReputationChartDataItem[] => {
  let topContributors: ReputationChartDataItem[] = contributorsList
    // Filter out the contributors without reputation
    .filter(({ reputation }) => reputation && reputation > 0)
    .slice(0, WIDGET_TEAM_LIMIT)
    .map(({ walletAddress, user, reputation }, index) => {
      return {
        id: walletAddress,
        label: user?.profile?.displayName || '',
        value: reputation || 0,
        color: getTeamHexColor(CONTRIBUTORS_COLORS_LIST[index]),
      };
    });

  const reputationOtherContributors = contributorsList
    .slice(WIDGET_TEAM_LIMIT)
    .reduce(
      (reputation, contributor) => reputation + (contributor.reputation || 0),
      0,
    );

  if (reputationOtherContributors > 0) {
    topContributors.push({
      id: 'allOtherUsers',
      label: formatText(MSG.otherLabel),
      value: reputationOtherContributors,
      color: '--color-gray-400',
    });
  }

  const adjustedValues = adjustPercentagesTo100(
    topContributors.map((contributor) => contributor.value),
    // We are rounding to 2 decimals everywhere
    2,
  );
  topContributors = topContributors.map((contributor, idx) => ({
    ...contributor,
    value: adjustedValues[idx],
  }));

  return topContributors;
};
