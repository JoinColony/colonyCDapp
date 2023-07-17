import { Id } from '@colony/colony-js';
import { ADDRESS_ZERO } from '~constants';
import { useGetUserReputationQuery } from '~gql';
import { useColonyContext } from '~hooks';

export const useTeamReputationSummary = () => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};

  const teams = domains?.items
    .map((team) => {
      const { nativeId, metadata } = team || {};
      const { color, name: teamName } = metadata || {};

      return {
        nativeId,
        color,
        teamName,
      };
    })
    .filter((team) => team.nativeId !== 1);

  const { data: totalPoints } = useGetUserReputationQuery({
    variables: {
      input: {
        walletAddress: ADDRESS_ZERO,
        colonyAddress: colony?.colonyAddress || '',
        domainId: Id.RootDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    teams,
    totalPoints: Number(totalPoints?.getUserReputation) || 0,
  };
};
