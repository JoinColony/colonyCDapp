import { useEffect, useState } from 'react';
import { MotionState, VotingReputationFactory } from '@colony/colony-js';

import useAppContext from './useAppContext';
import useEnabledExtensions from './useEnabledExtensions';

export type MotionStatesMap = Map<string, MotionState | null>;

/**
 * Hook that accepts an array of motion IDs and returns a map of motion IDs to their states
 * Make sure to memoize the array of motion IDs to avoid infinite loops
 */
const useNetworkMotionStates = (nativeMotionIds: string[]) => {
  const { wallet } = useAppContext();
  const { votingReputationAddress } = useEnabledExtensions();

  const [loading, setLoading] = useState(false);
  const [motionStatesMap, setMotionStatesMap] = useState<MotionStatesMap>(
    new Map(),
  );

  useEffect(() => {
    const { ethersProvider } = wallet || {};
    if (
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

    const votingRepClient = VotingReputationFactory.connect(
      votingReputationAddress,
      ethersProvider,
    );

    const fetchMotionStates = async () => {
      setLoading(true);

      const statesMap = new Map(motionStatesMap);
      await Promise.all(
        newMotionIds.map(async (nativeMotionId) => {
          try {
            const motionState = await votingRepClient.getMotionState(
              nativeMotionId,
            );
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
  }, [motionStatesMap, nativeMotionIds, votingReputationAddress, wallet]);

  return { motionStatesMap, loading };
};

export default useNetworkMotionStates;
