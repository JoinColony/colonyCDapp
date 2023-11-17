import { useMemo, useState } from 'react';
import { Id } from '@colony/colony-js';
import { useGetColonyContributorsQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { formatText } from '~utils/intl';
import { useActionsList } from '~v5/common/ActionSidebar/hooks';
import {
  setHexTeamColor,
  setTeamColor,
} from '~v5/common/TeamReputationSummary/utils';
import { ChartData, UseGetHomeWidgetReturnType } from './types';

export const useGetAllColonyMembers = (
  colonyAddress: string,
  team?: number,
) => {
  const { data, loading } = useGetColonyContributorsQuery({
    variables: {
      colonyAddress,
    },
    skip: !colonyAddress,
  });

  const { items } = data?.getContributorsByColony || {};

  const allMembers = useMemo(
    () =>
      items
        ?.filter(notNull)
        .filter(
          ({ isVerified, hasPermissions, hasReputation, isWatching }) =>
            isWatching || hasPermissions || hasReputation || isVerified,
        ) ?? [],
    [items],
  );

  const filteredMembers = useMemo(
    () =>
      team
        ? allMembers.filter(
            ({ roles, reputation }) =>
              roles?.items?.find((role) => role?.domain.nativeId === team) ||
              reputation?.items?.find((rep) => rep?.domain.nativeId === team),
          )
        : allMembers,
    [allMembers, team],
  );

  return {
    colonyMembers: filteredMembers,
    loading,
  };
};

export const useGetHomeWidget = (team?: number): UseGetHomeWidgetReturnType => {
  const { colony } = useColonyContext();
  const { domains, colonyAddress, nativeToken } = colony || {};
  const { balances } = colony || {};
  const [hoveredSegment, setHoveredSegment] = useState<
    ChartData | undefined | null
  >();

  const currentTokenBalance =
    getBalanceForTokenAndDomain(
      balances,
      nativeToken?.tokenAddress || '',
      team,
    ) || 0;

  const { colonyMembers, loading: membersLoading } = useGetAllColonyMembers(
    colonyAddress || '',
    team,
  );

  const actionsList = useActionsList();
  const activeActions = actionsList
    .map((action) => action.options)
    .flat()
    .filter((option) => !option.isDisabled).length;

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === team,
  )?.metadata?.color;

  const teamColor = setTeamColor(selectedTeamColor);
  const mappedMembers = useMemo(
    () =>
      colonyMembers
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
    [colonyMembers],
  );

  const allTeams = domains?.items
    .filter(notNull)
    .filter(({ nativeId }) => nativeId !== Id.RootDomain)
    .sort(
      (a, b) => Number(b.reputationPercentage) - Number(a.reputationPercentage),
    );

  const otherTeamsReputation = allTeams
    ?.slice(3, allTeams.length)
    .filter((item) => item.reputationPercentage !== null)
    .reduce((acc, item) => acc + Number(item.reputationPercentage), 0);

  const otherTeams = {
    id: '4',
    label: formatText({ id: 'label.allOther' }) ?? '',
    value: otherTeamsReputation ?? 0,
    color: '#F2F4F7',
    stroke: '#F2F4F7',
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
    activeActions,
    allMembers: mappedMembers,
    teamColor,
    currentTokenBalance,
    nativeToken,
    membersLoading,
    chartData,
    allTeams,
    otherTeamsReputation,
    hoveredSegment,
    setHoveredSegment,
  };
};
