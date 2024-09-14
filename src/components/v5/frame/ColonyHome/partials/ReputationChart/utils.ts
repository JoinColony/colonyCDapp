import { Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { type MemberItem } from '~frame/v5/pages/MembersPage/types.ts';
import { type Domain } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamHexColor } from '~utils/teams.ts';

import { CONTRIBUTORS_COLORS_LIST } from './consts.ts';
import { type ReputationChartDataItem } from './types.ts';

const WIDGET_TEAM_LIMIT = 4;

const MSG = defineMessages({
  otherLabel: {
    id: `v5.frame.ColonyHome.ReputationChart.otherLabel`,
    defaultMessage: 'All other',
  },
});

export const isThereReputationInDomains = (colonyDomains: Domain[]) => {
  return colonyDomains.some(
    (domain) => Number(domain.reputationPercentage) > 0,
  );
};

export const getNormalisedDomainReputationPercentage = (
  domain: Domain,
  normalisedTotalReputation: number,
) => (Number(domain.reputation) * 100) / normalisedTotalReputation;

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
    Number(rootTeam?.reputationPercentage) > 0
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
    (reputation, team) => reputation + Number(team.reputation),
    0,
  );

  const topTeams = domainsWithoutRoot
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
    return [
      ...topTeams,
      {
        id: 'allOtherTeams',
        label: formatText(MSG.otherLabel),
        value: reputationInOtherTeams,
        color: '--color-gray-400',
      },
    ];
  }

  return topTeams;
};

export const getContributorReputationChartData = (
  contributorsList: MemberItem[],
): ReputationChartDataItem[] => {
  const topContributors = contributorsList
    .slice(0, WIDGET_TEAM_LIMIT)
    .map(({ walletAddress, user, reputation }, index) => {
      return {
        id: walletAddress,
        label: user?.profile?.displayName || '',
        value: Number(reputation),
        color: getTeamHexColor(CONTRIBUTORS_COLORS_LIST[index]),
      };
    });

  const reputationInOtherContributors = contributorsList
    .slice(WIDGET_TEAM_LIMIT)
    .reduce((reputation, team) => reputation + Number(team.reputation), 0);

  if (reputationInOtherContributors > 0) {
    return [
      ...topContributors,
      {
        id: 'allOtherTeams',
        label: formatText(MSG.otherLabel),
        value: reputationInOtherContributors,
        color: '--color-gray-400',
      },
    ];
  }

  return topContributors;
};
