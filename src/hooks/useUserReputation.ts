import { gql, useQuery } from '@apollo/client';
import { Id } from '@colony/colony-js';

import { Address } from '~types';
import { ADDRESS_ZERO } from '~constants';
import { getUserReputation } from '~gql';

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
  const { data: userReputationData } = useQuery(gql(getUserReputation), {
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
  const userReputation = userReputationData?.getUserReputation;

  const { data: totalReputationData } = useQuery(gql(getUserReputation), {
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
  const totalReputation = totalReputationData?.getUserReputation;

  return {
    userReputation,
    totalReputation,
  };
};

export default useUserReputation;
