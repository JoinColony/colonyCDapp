import { toFinite } from '~utils/lodash';
import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';

const useColonyHasReputation = (
  colonyAddress: string,
  reputationDomain?: number,
) => {
  const { data, error } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress,
        domainId: reputationDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return !!toFinite(data?.getUserReputation) && !error;
};

export default useColonyHasReputation;
