import {
  getExtensionHash,
  type MotionState,
  VotingReputationFactory,
} from '@colony/colony-js';
import { Extension } from '@colony/colony-js';
import { useEffect, useMemo, useState } from 'react';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetJoinedColoniesExtensionsQuery } from '~gql';
import { type JoinedColonyWithExtensions } from '~types/graphql.ts';
import { notNull, notUndefined } from '~utils/arrays/index.ts';

export type MotionStatesMap = Map<string, MotionState | null>;
export type VotingReputationByColonyAddress = Record<string, string>;

export type UserMotionStake = {
  motionId: string;
  colonyAddress: string;
  databaseMotionId: string;
};

const getVotingReputationAddressByColony = (
  colony: JoinedColonyWithExtensions,
) => {
  const colonyExtensions = colony?.extensions?.items?.filter(notNull);
  if (!colonyExtensions) {
    return [];
  }

  const votingRepExtension = colonyExtensions.find(
    (extension) =>
      extension.hash === getExtensionHash(Extension.VotingReputation),
  );

  return votingRepExtension?.address;
};

const useGetVotingReputationByColony = (userAddress?: string) => {
  const { data, loading } = useGetJoinedColoniesExtensionsQuery({
    variables: {
      contributorAddress: userAddress ?? ADDRESS_ZERO,
    },
    skip: !userAddress,
    fetchPolicy: 'cache-and-network',
  });

  const joinedColoniesWithExtensions = useMemo(() => {
    return (
      data?.getContributorsByAddress?.items
        .filter(notNull)
        .map((contributor) => contributor.colony) ?? []
    );
  }, [data?.getContributorsByAddress?.items]);

  const votingReputationByColony = useMemo(() => {
    return joinedColoniesWithExtensions.reduce((prev, colony) => {
      if (!colony) {
        return prev;
      }
      return {
        ...prev,
        [colony.colonyAddress]: getVotingReputationAddressByColony(colony),
      };
    }, {});
  }, [joinedColoniesWithExtensions]);

  return {
    votingReputationByColony,
    loading,
  };
};

/**
 * Hook that accepts an array of UserMotionStake and returns a map of motion IDs to their states
 * Make sure to memoize the array of UserMotionStakes to avoid infinite loops
 */
const useNetworkMotionStatesAllColonies = (
  userMotionStakes: UserMotionStake[],
  skip?: boolean,
) => {
  const { wallet } = useAppContext();

  const { votingReputationByColony, loading: votingReputationLoading } =
    useGetVotingReputationByColony(wallet?.address);

  const [loading, setLoading] = useState(false);

  const [motionStatesMap, setMotionStatesMap] = useState<MotionStatesMap>(
    new Map(),
  );

  useEffect(() => {
    const { ethersProvider } = wallet || {};
    const signer = ethersProvider?.getSigner(wallet?.address); // Properly initialize the signer with the current wallet address

    const votingReputationAddressesCount = Object.values(
      votingReputationByColony,
    ).filter(notUndefined).length;
    if (
      skip ||
      !userMotionStakes.length ||
      !votingReputationAddressesCount ||
      !ethersProvider ||
      !signer
    ) {
      return;
    }

    const newMotionStakes = userMotionStakes.filter((motion) => {
      return !motionStatesMap.has(motion.databaseMotionId);
    });
    const deletedDatabaseIds = Array.from(motionStatesMap.keys()).filter(
      (databaseMotionId) =>
        !userMotionStakes.some((m) => m.databaseMotionId === databaseMotionId),
    );

    if (!newMotionStakes.length && !deletedDatabaseIds.length) {
      return;
    }

    const fetchMotionStates = async () => {
      setLoading(true);
      const statesMap = new Map(motionStatesMap);

      await Promise.all(
        newMotionStakes.map(async (motionStake) => {
          const votingReputationAddress =
            votingReputationByColony[motionStake.colonyAddress];
          const motionStateKey = motionStake.databaseMotionId;

          if (!votingReputationAddress) {
            statesMap.set(motionStateKey, null);
            return;
          }
          const votingRepClient = VotingReputationFactory.connect(
            votingReputationAddress,
            signer,
          );

          try {
            const motionState = await votingRepClient.getMotionState(
              motionStake.motionId,
            );
            statesMap.set(motionStateKey, motionState);
          } catch (e) {
            console.error(e);
            statesMap.set(motionStateKey, null);
          }
        }),
      );
      deletedDatabaseIds.forEach((databaseMotionId) =>
        statesMap.delete(databaseMotionId),
      );

      setMotionStatesMap(statesMap);
      setLoading(false);
    };

    fetchMotionStates();
  }, [
    userMotionStakes,
    votingReputationByColony,
    skip,
    wallet,
    motionStatesMap,
  ]);

  return {
    motionStatesMap,
    votingReputationByColony,
    loading: loading || votingReputationLoading,
  };
};

export default useNetworkMotionStatesAllColonies;
