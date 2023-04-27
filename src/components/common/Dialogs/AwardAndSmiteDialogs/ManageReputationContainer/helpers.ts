import Decimal from 'decimal.js';

import { useGetMembersForColonyQuery } from '~gql';
import { Address, Colony, Contributor, MemberUser, Watcher } from '~types';
import { notMaybe } from '~utils/arrays';

export const getManageReputationDialogPayload = (
  colony: Colony,
  isSmiteAction: boolean,
  nativeTokenDecimals: number,
  { amount, domainId, annotation, user, motionDomainId },
) => {
  const reputationChangeAmount = new Decimal(amount)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    // Smite amount needs to be negative, otherwise leave it as it is
    .mul(isSmiteAction ? -1 : 1);

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainId,
    userAddress: user.walletAddress,
    annotationMessage: annotation,
    amount: reputationChangeAmount.toString(),
    motionDomainId,
    isSmitingReputation: isSmiteAction,
  };
};

export const useGetColonyMembers = (colonyAddress?: Address | null) => {
  const { data } = useGetMembersForColonyQuery({
    skip: !colonyAddress,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
      },
    },
  });

  const watchers = data?.getMembersForColony?.watchers ?? [];
  const contributors = data?.getMembersForColony?.contributors ?? [];
  const allMembers: (Watcher | Contributor)[] = [...watchers, ...contributors];
  return allMembers.map((member) => member.user).filter<MemberUser>(notMaybe);
};
