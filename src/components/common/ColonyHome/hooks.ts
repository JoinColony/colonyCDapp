import { useColonyContext, useGetColonyMembers } from '~hooks';
import { getBalanceForTokenAndDomain } from '~utils/tokens';
import { useActionsList } from '~v5/common/ActionSidebar/hooks';
import { setTeamColor } from './consts';
import { UseGetHomeWidgetReturnType } from './types';

export const useGetHomeWidget = (team?: number): UseGetHomeWidgetReturnType => {
  const { colony } = useColonyContext();
  const { domains, colonyAddress, nativeToken } = colony || {};
  const { balances } = colony || {};

  const currentTokenBalance =
    getBalanceForTokenAndDomain(
      balances,
      nativeToken?.tokenAddress || '',
      team,
    ) || 0;

  const { allMembers, loading: membersLoading } =
    useGetColonyMembers(colonyAddress);

  const actionsList = useActionsList();
  const activeActions = actionsList
    .map((action) => action.options)
    .flat()
    .filter((option) => !option.isDisabled).length;

  const selectedTeamColor = domains?.items.find(
    (domain) => domain?.nativeId === team,
  )?.metadata?.color;

  const teamColor = setTeamColor(selectedTeamColor);
  const mappedMembers = allMembers
    .map((member) => ({
      address: member.walletAddress,
      ...member,
    }))
    .filter(
      (member, index, self) =>
        index === self.findIndex((m) => m.address === member.address),
    )
    .sort(() => Math.random() - 0.5);

  return {
    activeActions,
    allMembers: mappedMembers,
    teamColor,
    currentTokenBalance,
    nativeToken,
    membersLoading,
  };
};
