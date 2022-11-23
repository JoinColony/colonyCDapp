import { gql, useQuery } from '@apollo/client';

import { Address } from '~types';
import { getReputationForTopDomains } from '~gql';
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
  const { data: userReputationData, loading: loadingUserReputation } = useQuery(
    gql(getReputationForTopDomains),
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

  const userReputation: UserDomainReputation[] =
    userReputationData?.getReputationForTopDomains?.items;

  return {
    userReputation,
    loadingUserReputation,
  };
};

export default useUserReputationForTopDomains;
