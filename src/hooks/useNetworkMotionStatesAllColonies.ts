import {
  getExtensionHash,
  type MotionState,
  VotingReputationFactory,
} from '@colony/colony-js';
import { Extension } from '@colony/colony-js';
import { useEffect, useMemo, useState } from 'react';

import { ADDRESS_ZERO, supportedExtensionsConfig } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetJoinedColoniesExtensionsQuery } from '~gql';
import { notNull, notUndefined } from '~utils/arrays/index.ts';

export type MotionStatesMap = Map<string, MotionState | null>;

export type MotionStatesMapByColonies = Record<string, MotionStatesMap>;

export type RefetchMotionStates = (motionIdsToRefetch?: string[]) => void;

export type MotionId = {
  motionId: string;
  colonyAddress: string;
  databaseMotionId: string;
};

const getVotingReputationAddressByColony = (colony) => {
  const colonyExtensions = colony?.extensions?.items?.filter(notNull);
  if (!colonyExtensions) {
    return [];
  }

  const currentExtensionAddress = colonyExtensions.find((extension) => {
    const extensionConfig = supportedExtensionsConfig.find(
      (e) => getExtensionHash(e?.extensionId) === extension?.hash,
    );
    return extensionConfig?.extensionId === Extension.VotingReputation;
  });
  return currentExtensionAddress?.address;
};

const useJoinedColoniesWithExtensions = (userAddress?: string) => {
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

  return {
    joinedColoniesWithExtensions,
    loading,
  };
};

/**
 * Hook that accepts an array of motion IDs object and returns a map of motion IDs to their states
 * Make sure to memoize the array of motion IDs to avoid infinite loops
 */
const useNetworkMotionStatesAllColonies = (
  motionIdsMap: MotionId[],
  skip?: boolean,
) => {
  const { wallet } = useAppContext();

  const {
    joinedColoniesWithExtensions,
    loading: joinedColoniesWithExtensionsLoading,
  } = useJoinedColoniesWithExtensions(wallet?.address);

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

  const [loading, setLoading] = useState(false);

  const [motionStatesMap, setMotionStatesMap] = useState<MotionStatesMap>(
    new Map(),
  );
  useEffect(() => {
    const { ethersProvider } = wallet || {};

    const votingReputationAddressesCount = Object.values(
      votingReputationByColony,
    ).filter(notUndefined).length;
    if (
      skip ||
      !motionIdsMap.length ||
      !votingReputationAddressesCount ||
      !ethersProvider
    ) {
      return;
    }

    const newMotionIds = motionIdsMap.filter((motion) => {
      return !motionStatesMap.has(motion.databaseMotionId);
    });
    const deletedMotionIds = Array.from(motionStatesMap.keys()).filter(
      (nativeMotionKey) =>
        !motionIdsMap.some((m) => m.databaseMotionId === nativeMotionKey),
    );

    if (!newMotionIds.length && !deletedMotionIds.length) {
      return;
    }

    const fetchMotionStates = async () => {
      setLoading(true);
      const statesMap = new Map(motionStatesMap);
      const signer = ethersProvider.getSigner(wallet?.address); // Properly initialize the signer with the current wallet address

      await Promise.all(
        newMotionIds.map(async (nativeMotion) => {
          const votingReputationAddress =
            votingReputationByColony[nativeMotion.colonyAddress];
          if (!votingReputationAddress) {
            return;
          }
          const votingRepClient = VotingReputationFactory.connect(
            votingReputationAddress,
            signer,
          );

          const motionStateKey = nativeMotion.databaseMotionId;
          try {
            const motionState = await votingRepClient.getMotionState(
              nativeMotion.motionId,
            );
            statesMap.set(motionStateKey, motionState);
          } catch (e) {
            console.error(e);
            statesMap.set(motionStateKey, null);
          }
        }),
      );
      deletedMotionIds.forEach((nativeMotionId) =>
        statesMap.delete(nativeMotionId),
      );

      setMotionStatesMap(statesMap);
      setLoading(false);
    };

    fetchMotionStates();
  }, [motionIdsMap, votingReputationByColony, skip, wallet, motionStatesMap]);

  return {
    motionStatesMap,
    votingReputationByColony,
    loading: loading || joinedColoniesWithExtensionsLoading,
  };
};

export default useNetworkMotionStatesAllColonies;
