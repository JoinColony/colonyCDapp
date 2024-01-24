import { Id } from '@colony/colony-js';

import { ADDRESS_ZERO } from '~constants';
import { useColonyContext } from '~context/ColonyContext';
import { useGetUserReputationQuery } from '~gql';

export const useTeamReputationSummaryRow = (id: number) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data: totalReputation } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress,
        domainId: id || Id.RootDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    totalReputation,
  };
};
