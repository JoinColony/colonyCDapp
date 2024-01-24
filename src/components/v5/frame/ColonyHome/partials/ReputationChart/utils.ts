import { Domain } from '~types/graphql';
import { getTeamHexColor } from '~utils/teams';
import { ChartData } from '~v5/shared/DonutChart/types';

const WIDGET_TEAM_LIMIT = 5;

export const getTeamReputationChartData = (allTeams: Domain[]): ChartData[] => {
  return allTeams
    .slice(0, WIDGET_TEAM_LIMIT)
    .map(({ id, metadata, reputationPercentage }) => {
      return {
        id,
        label: metadata?.name || '',
        value: Number(reputationPercentage),
        color: getTeamHexColor(metadata?.color),
        stroke: getTeamHexColor(metadata?.color),
      };
    });
};
