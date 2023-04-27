import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';

const useColonyHasReputation = (
  colonyAddress: string,
  reputationDomain?: number,
): boolean => {
  const { data, error, loading } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress,
        domainId: reputationDomain,
      },
    },
  });

  return loading || (!!data?.getUserReputation && !error);
};

export default useColonyHasReputation;
