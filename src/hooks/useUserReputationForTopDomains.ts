import { Address } from '~types';
import { useGetReputationForTopDomainsQuery } from '~gql';
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
  const { data: userReputationData, loading: loadingUserReputation } =
    useGetReputationForTopDomainsQuery({
      variables: {
        input: {
          colonyAddress: colonyAddress ?? '',
          walletAddress: walletAddress ?? '',
          rootHash,
        },
      },
      fetchPolicy: 'cache-and-network',
      skip: !colonyAddress || !walletAddress,
    });

  const userReputation =
    userReputationData?.getReputationForTopDomains?.items ?? undefined;

  return {
    userReputation,
    loadingUserReputation,
  };
};

export default useUserReputationForTopDomains;
