import { toFinite } from '~utils/lodash';
import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';

const useColonyHasReputation = (
  colonyAddress: string,
  reputationDomain?: number,
) => {
  const { data, error, loading } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress,
        domainId: reputationDomain,
      },
    },
  });

  return loading || (!!toFinite(data?.getUserReputation) && !error);
};

export default useColonyHasReputation;
