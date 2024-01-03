import { Id } from '@colony/colony-js';

import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';
import { useColonyContext } from '~hooks';

export const useTeamReputationSummaryRow = (id: number) => {
  const { colony } = useColonyContext();

  const { data: totalReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress: colony?.colonyAddress || '',
        domainId: id || Id.RootDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    totalReputation,
  };
};
