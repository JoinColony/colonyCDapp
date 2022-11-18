import { Id } from '@colony/colony-js';

import { Address } from '~types';
import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';

interface UseUserReputationHook {
  userReputation?: string;
  totalReputation?: string;
}

const useUserReputation = (
  colonyAddress?: Address,
  walletAddress?: Address,
  domainId = Id.RootDomain,
  rootHash?: string,
): UseUserReputationHook => {
  const { data: userReputationData } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
        walletAddress: walletAddress ?? '',
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'cache-and-network',
    skip: !colonyAddress || !walletAddress,
  });
  const userReputation = userReputationData?.getUserReputation ?? undefined;

  const { data: totalReputationData } = useGetUserReputationQuery({
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
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
  };
};

export default useUserReputation;
