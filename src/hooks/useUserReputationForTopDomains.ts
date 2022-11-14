import { gql, useQuery } from '@apollo/client';

import { Address } from '~types';
import { getUserReputationForTopDomains } from '~gql';
import { PercentageReputationType } from '~utils/reputation';

export type UserDomainReputation = {
  domainId?: number;
  reputationPercentage?: PercentageReputationType;
};

const useUserReputationForTopDomains = (
  colonyAddress?: Address,
  walletAddress?: Address,
  rootHash?: string,
) => {
  const { data: userReputationData } = useQuery(
    gql(getUserReputationForTopDomains),
    {
      variables: {
        input: {
          colonyAddress: colonyAddress ?? '',
          walletAddress: walletAddress ?? '',
          rootHash,
        },
      },
      fetchPolicy: 'cache-and-network',
      skip: !colonyAddress || !walletAddress,
    },
  );

  const userReputation: UserDomainReputation[] = userReputationData;

  return {
    userReputation,
  };
};

export default useUserReputationForTopDomains;
