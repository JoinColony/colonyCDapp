import { useMemo, useState } from 'react';
import { Id } from '@colony/colony-js';

import { BigNumber } from 'ethers';
import { useGetTotalColonyActionsQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { formatText } from '~utils/intl';
import {
  setHexTeamColor,
  setTeamColor,
} from '~v5/common/TeamReputationSummary/utils';
import { createBaseActionFilter } from '~hooks/useActivityFeed/helpers';
import { useMemberContext } from '~context/MemberContext';
import { Token, User, Domain } from '~types';

import { ChartData } from '../types';

interface UseGetHomeWidgetResult {
  totalActions: number;
  allMembers: User[];
  teamColor: string;
  currentTokenBalance: BigNumber;
  nativeToken: Token | undefined;
  membersLoading: boolean;
  chartColors?: string[];
  chartData?: ChartData[];
  allTeams?: Domain[];
  otherTeamsReputation?: number;
  hoveredSegment?: ChartData | null;
  updateHoveredSegment: (segmentData: ChartData | null | undefined) => void;
}
const WIDGET_TEAM_LIMIT = 3;

export const useGetHomeWidget = (team?: number): UseGetHomeWidgetResult => {
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
      team,
    ) || 0;

  const domainMembers = useMemo(
    () =>
      team
        ? members.filter(
            ({ roles, reputation }) =>
              roles?.items?.find((role) => role?.domain.nativeId === team) ||
              reputation?.items?.find((rep) => rep?.domain.nativeId === team),
          )
        : members,
    [members, team],
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
    (domain) => domain?.nativeId === team,
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

  const allTeams = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );
  const otherTeamsReputation = allTeams
    ?.slice(WIDGET_TEAM_LIMIT, allTeams.length)
    .filter((item) => item.reputationPercentage !== null)
    .reduce((acc, item) => acc + Number(item.reputationPercentage), 0);

  const otherTeams = {
    id: '4',
    label: formatText({ id: 'label.allOther' }),
    value: otherTeamsReputation ?? 0,
    color: '--color-teams-grey-100',
    stroke: '--color-teams-grey-100',
  };

  const firstThreeTeams = allTeams?.length
    ? allTeams
        .map(({ id, metadata, reputationPercentage }) => {
          return {
            id,
            label: metadata?.name || '',
            value: Number(reputationPercentage),
            color: setHexTeamColor(metadata?.color),
            stroke: setHexTeamColor(metadata?.color),
          };
        })
        .slice(0, 3)
    : [];

  const chartData = allTeams?.length ? [...firstThreeTeams, otherTeams] : [];

  return {
    totalActions,
    allMembers: mappedMembers,
    teamColor,
    currentTokenBalance,
    nativeToken,
    membersLoading,
    chartData,
    allTeams,
    otherTeamsReputation,
    hoveredSegment,
    updateHoveredSegment,
  };
};
