import { type MotionState, VotingReputationFactory } from '@colony/colony-js';
import { useEffect, useState } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';

import useEnabledExtensions from './useEnabledExtensions.ts';

export type MotionStatesMap = Map<string, MotionState | null>;

export type RefetchMotionStates = (motionIdsToRefetch?: string[]) => void;

/**
 * Hook that accepts an array of motion IDs and returns a map of motion IDs to their states
 * Make sure to memoize the array of motion IDs to avoid infinite loops
 */
const useNetworkMotionStates = (nativeMotionIds: string[], skip?: boolean) => {
  const { wallet } = useAppContext();
  const { votingReputationAddress } = useEnabledExtensions();

  const [loading, setLoading] = useState(false);
  const [motionStatesMap, setMotionStatesMap] = useState<MotionStatesMap>(
    new Map(),
  );

  useEffect(() => {
    const { ethersProvider, address } = wallet || {};
    if (
      skip ||
      !nativeMotionIds.length ||
      !votingReputationAddress ||
      !ethersProvider
    ) {
      return;
    }

    const newMotionIds = nativeMotionIds.filter(
      (nativeMotionId) => !motionStatesMap.has(nativeMotionId),
    );
    const deletedMotionIds = Array.from(motionStatesMap.keys()).filter(
      (nativeMotionId) => !nativeMotionIds.includes(nativeMotionId),
    );
    if (!newMotionIds.length && !deletedMotionIds.length) {
      return;
    }

    // Properly initialize the signer with the current wallet address
    const signer = ethersProvider.getSigner(address);

    const votingRepClient = VotingReputationFactory.connect(
      votingReputationAddress,
      signer,
    );

    const fetchMotionStates = async () => {
      setLoading(true);

      const statesMap = new Map(motionStatesMap);
      await Promise.all(
        newMotionIds.map(async (nativeMotionId) => {
          try {
            const motionState =
              await votingRepClient.getMotionState(nativeMotionId);
            statesMap.set(nativeMotionId, motionState);
          } catch {
            statesMap.set(nativeMotionId, null);
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
  }, [motionStatesMap, nativeMotionIds, skip, votingReputationAddress, wallet]);

  const refetch: RefetchMotionStates = (motionIdsToRefetch) => {
    if (!motionIdsToRefetch?.length) {
      setMotionStatesMap(new Map());
    } else {
      setMotionStatesMap((prevMotionStatesMap) => {
        const newMotionStatesMap = new Map(prevMotionStatesMap);

        motionIdsToRefetch.forEach((motionId) =>
          newMotionStatesMap.delete(motionId),
        );

        return newMotionStatesMap;
      });
    }
  };

  return {
    motionStatesMap,
    loading,
    refetch,
  };
};

export default useNetworkMotionStates;
