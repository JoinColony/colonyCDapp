import { MotionState, VotingReputationFactory } from '@colony/colony-js';
import { Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

import { useAppContext } from '~context/AppContext.tsx';

import useEnabledExtensions from './useEnabledExtensions.tsx';

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
    const { ethersProvider } = wallet || {};
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

    const votingRepClient = VotingReputationFactory.connect(
      votingReputationAddress,
      ethersProvider as unknown as Provider,
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
