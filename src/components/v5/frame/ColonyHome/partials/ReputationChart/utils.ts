import { Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { TEAM_SEARCH_PARAM } from '~routes';
import { type Domain } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { adjustPercentagesTo100 } from '~utils/numbers.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import { getTeamHexColor } from '~utils/teams.ts';

import { CONTRIBUTORS_COLORS_LIST } from './consts.ts';
import { type ContributorItem, type ReputationChartDataItem } from './types.ts';

const WIDGET_TEAM_LIMIT = 5;

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

export const getNormalisedReputationPercentage = (
  reputation: Domain['reputation'] | number,
  normalisedTotalReputation: number,
) => (Number(reputation || 0) * 100) / normalisedTotalReputation;

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
        id: rootTeam.nativeId.toString(),
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
    .slice(0, WIDGET_TEAM_LIMIT)
    .map((domain) => {
      return {
        id: domain.nativeId.toString(),
        label: domain.metadata?.name || '',
        value: getNormalisedReputationPercentage(
          domain.reputation,
          normalisedTotalReputation,
        ),
        color: getTeamHexColor(domain.metadata?.color),
        searchParam: TEAM_SEARCH_PARAM,
      };
    });

  if (domainsWithoutRoot.length > WIDGET_TEAM_LIMIT) {
    const reputationInOtherTeams = domainsWithoutRoot
      .slice(WIDGET_TEAM_LIMIT - 1)
      .reduce(
        (reputation, team) => reputation + Number(team.reputation || 0),
        0,
      );

    topTeams[topTeams.length - 1] = {
      id: 'allOtherTeams',
      label: formatText(MSG.otherLabel),
      value: getNormalisedReputationPercentage(
        reputationInOtherTeams,
        normalisedTotalReputation,
      ),
      color: '--color-gray-400',
      shouldTruncateLegendLabel: false,
    };
  }

  const adjustedValues = adjustPercentagesTo100(
    topTeams.map((team) => team.value || 0),
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
        label: user?.profile?.displayName || splitWalletAddress(walletAddress),
        value: reputation || 0,
        color: getTeamHexColor(CONTRIBUTORS_COLORS_LIST[index]),
      };
    });

  const contributorsWithReputation = contributorsList.filter(
    (contributor) => contributor.reputation && contributor.reputation > 0,
  );

  if (contributorsWithReputation.length > WIDGET_TEAM_LIMIT) {
    const reputationOtherContributors = contributorsWithReputation
      .slice(WIDGET_TEAM_LIMIT - 1)
      .reduce(
        (reputation, contributor) => reputation + (contributor.reputation || 0),
        0,
      );

    topContributors[topContributors.length - 1] = {
      id: 'allOtherUsers',
      label: formatText(MSG.otherLabel),
      value: reputationOtherContributors,
      color: '--color-gray-400',
    };
  }

  const adjustedValues = adjustPercentagesTo100(
    topContributors.map((contributor) => contributor.value || 0),
    // We are rounding to 2 decimals everywhere
    2,
  );
  topContributors = topContributors.map((contributor, idx) => ({
    ...contributor,
    value: adjustedValues[idx],
  }));

  return topContributors;
};
