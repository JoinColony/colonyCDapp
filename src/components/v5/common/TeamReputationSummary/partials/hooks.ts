import { Id } from '@colony/colony-js';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
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
