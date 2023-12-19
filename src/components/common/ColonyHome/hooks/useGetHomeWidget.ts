import { useState } from 'react';
import { Id } from '@colony/colony-js';

import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { formatText } from '~utils/intl';
import { Domain } from '~types';

import { ChartData } from '../types';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { setHexTeamColor, setTeamColor } from '~utils/teams';

interface UseGetHomeWidgetResult {
  teamColor: string;
  chartColors?: string[];
  chartData: ChartData[];
  hoveredSegment?: ChartData | null;
  updateHoveredSegment: (segmentData: ChartData | null | undefined) => void;
}

const WIDGET_TEAM_LIMIT = 4;
const TOP_TEAMS_WIDGET_LIMIT = WIDGET_TEAM_LIMIT - 1;

const getTeamReputationChartData = (allTeams: Domain[]): ChartData[] => {
  if (allTeams.length <= WIDGET_TEAM_LIMIT) {
    return allTeams.map(({ id, metadata, reputationPercentage }) => {
      return {
        id,
        label: metadata?.name || '',
        value: Number(reputationPercentage),
        color: setHexTeamColor(metadata?.color),
        stroke: setHexTeamColor(metadata?.color),
      };
    });
  }

  const otherTeamsReputation = allTeams
    .slice(TOP_TEAMS_WIDGET_LIMIT)
    .reduce(
      (acc, item) =>
        item.reputationPercentage !== null
          ? acc + Number(item.reputationPercentage)
          : acc,
      0,
    );

  const otherTeams = {
    id: 'otherTeams',
    label: formatText({ id: 'label.allOther' }),
    value: otherTeamsReputation ?? 0,
    color: '--color-teams-grey-100',
    stroke: '--color-teams-grey-100',
  };

  const topTeams = allTeams
    .slice(0, TOP_TEAMS_WIDGET_LIMIT)
    .map(({ id, metadata, reputationPercentage }) => {
      return {
        id,
        label: metadata?.name || '',
        value: Number(reputationPercentage),
        color: setHexTeamColor(metadata?.color),
        stroke: setHexTeamColor(metadata?.color),
      };
    });

  return [...topTeams, otherTeams];
};

export const useGetHomeWidget = (): UseGetHomeWidgetResult => {
  const selectedTeam = useGetSelectedTeamFilter();
  const nativeTeamId = selectedTeam?.nativeId ?? undefined;

  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const updateHoveredSegment = (segmentData: ChartData | null | undefined) => {
    setHoveredSegment(segmentData);
  };

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeTeamId,
  )?.metadata?.color;

  const teamColor = setTeamColor(selectedTeamColor);

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const chartData = getTeamReputationChartData(allTeams);

  return {
    teamColor,
    chartData,
    hoveredSegment,
    updateHoveredSegment,
  };
};
