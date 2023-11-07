import { useEffect, useState } from 'react';
import { BigNumberish } from 'ethers';
import { MotionState, VotingReputationFactory } from '@colony/colony-js';
import useAppContext from './useAppContext';
import useEnabledExtensions from './useEnabledExtensions';

export const useNetworkMotionState = (nativeMotionId: BigNumberish) => {
  const { wallet } = useAppContext();
  const { votingReputationAddress } = useEnabledExtensions();
  const [networkMotionState, setNetworkMotionState] =
    useState<MotionState | null>(null);
  useEffect(() => {
    if (!wallet || !votingReputationAddress) {
      return;
    }
    const fetchMotionState = async () => {
      const { ethersProvider } = wallet;
      if (!ethersProvider) {
        return;
      }
      const votingRepClient = VotingReputationFactory.connect(
        votingReputationAddress,
        ethersProvider,
      );
      const motionState = await votingRepClient.getMotionState(nativeMotionId);
      setNetworkMotionState(motionState);
    };
    fetchMotionState();
  }, [nativeMotionId, votingReputationAddress, wallet]);
  return networkMotionState;
};
