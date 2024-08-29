import { Id } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { type Domain } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getTeamHexColor } from '~utils/teams.ts';

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

export const getTeamReputationChartData = (
  allTeams: Domain[],
): ReputationChartDataItem[] => {
  const rootTeam = allTeams.find(({ nativeId }) => nativeId === Id.RootDomain);
  const domainsWithoutRoot = allTeams.filter(
    ({ nativeId }) => nativeId !== Id.RootDomain,
  );

  // if we only have reputation in root, we show just the root team
  if (
    rootTeam &&
    !isThereReputationInDomains(domainsWithoutRoot) &&
    Number(rootTeam?.reputationPercentage) > 0
  ) {
    return [
      {
        id: rootTeam.id,
        label: rootTeam.metadata?.name || '',
        value: Number(rootTeam.reputationPercentage),
        color: getTeamHexColor(rootTeam.metadata?.color),
      },
    ];
  }

  const topTeams = domainsWithoutRoot
    .slice(0, WIDGET_TEAM_LIMIT)
    .map(({ id, metadata, reputationPercentage }) => {
      return {
        id,
        label: metadata?.name || '',
        value: Number(reputationPercentage),
        color: getTeamHexColor(metadata?.color),
      };
    });

  const reputationInOtherTeams = allTeams
    .slice(WIDGET_TEAM_LIMIT)
    .reduce(
      (reputation, team) => reputation + Number(team.reputationPercentage),
      0,
    );

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
