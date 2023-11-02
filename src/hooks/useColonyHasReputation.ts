import { BigNumber } from 'ethers';
import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';

const useColonyHasReputation = (
  colonyAddress: string | undefined,
  reputationDomain?: number,
): boolean => {
  const { data, error, loading } = useGetUserReputationQuery({
    skip: !colonyAddress,
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress: colonyAddress || '',
        domainId: reputationDomain,
      },
    },
  });

  const rep = BigNumber.from(data?.getUserReputation ?? 0);

  return loading || (!rep.isZero() && !error);
};

export default useColonyHasReputation;
