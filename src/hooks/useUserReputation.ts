import { Id } from '@colony/colony-js';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useGetUserReputationQuery } from '~gql';
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
  const { data: userReputationData, loading: loadingUserReputation } =
    useGetUserReputationQuery({
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

  const { data: totalReputationData, loading: loadingTotalReputation } =
    useGetUserReputationQuery({
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

  return {
    userReputation,
    totalReputation,
    loading: loadingUserReputation || loadingTotalReputation,
  };
};

export default useUserReputation;
