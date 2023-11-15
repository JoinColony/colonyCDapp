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
    if (!votingReputationAddress || !ethersProvider) {
      return;
    }

    const votingRepClient = VotingReputationFactory.connect(
      votingReputationAddress,
      ethersProvider,
    );

    const fetchMotionStates = async () => {
      setLoading(true);
      const statesMap = new Map();
      await Promise.all(
        nativeMotionIds.map(async (nativeMotionId) => {
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

      setMotionStatesMap(statesMap);
      setLoading(false);
    };

    fetchMotionStates();
  }, [nativeMotionIds, votingReputationAddress, wallet]);

  return { motionStatesMap, loading };
};

export default useNetworkMotionStates;
