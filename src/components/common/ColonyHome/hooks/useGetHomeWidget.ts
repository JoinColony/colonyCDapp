import { useMemo, useState } from 'react';
import { Id } from '@colony/colony-js';

import { BigNumber } from 'ethers';
import { useGetTotalColonyActionsQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { formatText } from '~utils/intl';
import { createBaseActionFilter } from '~hooks/useActivityFeed/helpers';
import { useMemberContext } from '~context/MemberContext';
import { Token, User, Domain } from '~types';

import { ChartData } from '../types';
import { useGetSelectedTeamFilter } from '~hooks/useTeamsBreadcrumbs';
import { setHexTeamColor, setTeamColor } from '~utils/teams';

interface UseGetHomeWidgetResult {
  totalActions: number;
  allMembers: User[];
  teamColor: string;
  currentTokenBalance: BigNumber;
  nativeToken: Token | undefined;
  membersLoading: boolean;
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
  const { domains, nativeToken, colonyAddress = '' } = colony || {};
  const { balances } = colony || {};

  const { totalMembers: members, loading: membersLoading } = useMemberContext();

  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const updateHoveredSegment = (segmentData: ChartData | null | undefined) => {
    setHoveredSegment(segmentData);
  };

  const currentTokenBalance =
    getBalanceForTokenAndDomain(
      balances,
      nativeToken?.tokenAddress || '',
      nativeTeamId,
    ) || 0;

  const domainMembers = useMemo(
    () =>
      nativeTeamId
        ? members.filter(
            ({ roles, reputation }) =>
              roles?.items?.find(
                (role) => role?.domain.nativeId === nativeTeamId,
              ) ||
              reputation?.items?.find(
                (rep) => rep?.domain.nativeId === nativeTeamId,
              ),
          )
        : members,
    [members, nativeTeamId],
  );

  const { data: totalActionData } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        ...createBaseActionFilter(colonyAddress),
      },
    },
  });

  const totalActions = totalActionData?.searchColonyActions?.total ?? 0;

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === nativeTeamId,
  )?.metadata?.color;

  const teamColor = setTeamColor(selectedTeamColor);
  const mappedMembers = useMemo(
    () =>
      domainMembers
        .filter(
          (member, index, self) =>
            index ===
            self.findIndex(
              (m) => m.contributorAddress === member.contributorAddress,
            ),
        )
        .map((member) => ({
          walletAddress: member.contributorAddress,
          ...member.user,
        }))
        .sort(() => Math.random() - 0.5),
    [domainMembers],
  );

  const allTeams = (domains?.items || [])
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const chartData = getTeamReputationChartData(allTeams);

  return {
    totalActions,
    allMembers: mappedMembers,
    teamColor,
    currentTokenBalance,
    nativeToken,
    membersLoading,
    chartData,
    hoveredSegment,
    updateHoveredSegment,
  };
};
