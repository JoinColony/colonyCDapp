import { useMemo } from 'react';
import { useGetColonyContributorsQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { useActionsList } from '~v5/common/ActionSidebar/hooks';
import { setTeamColor } from './consts';
import { UseGetHomeWidgetReturnType } from './types';

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
  const { domains, colonyAddress, nativeToken, balances } = colony || {};

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

  return {
    activeActions,
    allMembers: mappedMembers,
    teamColor,
    currentTokenBalance,
    nativeToken,
    membersLoading,
  };
};
