import { Id } from '@colony/colony-js';
import { useEffect } from 'react';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useGetUserReputationQuery, useOnUpdateColonySubscription } from '~gql';
import { type Address } from '~types/index.ts';

interface UseUserReputationHook {
  userReputation: string | undefined;
  totalReputation: string | undefined;
  loading: boolean;
}

const useUserReputation = ({
  colonyAddress,
  walletAddress,
  domainId = Id.RootDomain,
  rootHash,
}: {
  colonyAddress: Address;
  walletAddress: Address | null | undefined;
  domainId?: Id;
  rootHash?: string;
}): UseUserReputationHook => {
  const {
    data: userReputationData,
    loading: loadingUserReputation,
    refetch: refetchUser,
  } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress,
        walletAddress: walletAddress ?? '',
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'cache-and-network',
    skip: !colonyAddress || !walletAddress,
  });
  const userReputation = userReputationData?.getUserReputation ?? undefined;

  const {
    data: totalReputationData,
    loading: loadingTotalReputation,
    refetch: refetchTotal,
  } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress,
        walletAddress: ADDRESS_ZERO,
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'cache-and-network',
    skip: !colonyAddress,
  });
  const totalReputation = totalReputationData?.getUserReputation ?? undefined;

  const { data } = useOnUpdateColonySubscription();

  useEffect(() => {
    let timeout;
    // When the colony first loads, the reputation is updated asynchronously. This means that the currently
    // cached reputation might be out of date. If this is the case, we should refetch.
    if (data?.onUpdateColony?.lastUpdatedContributorsWithReputation) {
      // It looks hacky, but we need the timeout to ensure that opensearch has been updated before we refetch.
      timeout = setTimeout(() => {
        refetchTotal();
        refetchUser();
      }, 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    data?.onUpdateColony?.lastUpdatedContributorsWithReputation,
    refetchTotal,
    refetchUser,
  ]);

  return {
    userReputation,
    totalReputation,
    loading: loadingUserReputation || loadingTotalReputation,
  };
};

export default useUserReputation;
