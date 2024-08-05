import {
  getExtensionHash,
  type MotionState,
  VotingReputationFactory,
} from '@colony/colony-js';
import { Extension } from '@colony/colony-js';
import { type Provider } from '@ethersproject/providers';
import { useEffect, useMemo, useState } from 'react';

import { supportedExtensionsConfig } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { notNull, notUndefined } from '~utils/arrays/index.ts';

import useJoinedColoniesWithExtensions from './useJoinedColoniesWithExtensions.ts';

export type MotionStatesMap = Map<string, MotionState | null>;

export type MotionStatesMapByColonies = Record<string, MotionStatesMap>;

export type RefetchMotionStates = (motionIdsToRefetch?: string[]) => void;

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
  return currentExtensionAddress.address;
};

const getMotionName = ({ colonyAddress, motionId }) => {
  return `${colonyAddress}-${motionId}`;
};

/**
 * Hook that accepts an array of motion IDs and returns a map of motion IDs to their states
 * Make sure to memoize the array of motion IDs to avoid infinite loops
 */
const useNetworkMotionStatesAllColonies = (
  motionIdsMap: { motionId: string; colonyAddress: string }[],
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
      const motionStateKey = getMotionName({
        colonyAddress: motion.colonyAddress,
        motionId: motion.motionId,
      });
      return !motionStatesMap.has(motionStateKey);
    });
    const deletedMotionIds = Array.from(motionStatesMap.keys()).filter(
      (nativeMotionKey) =>
        !motionIdsMap.some(
          (m) =>
            getMotionName({
              colonyAddress: m.colonyAddress,
              motionId: m.motionId,
            }) === nativeMotionKey,
        ),
    );

    if (!newMotionIds.length && !deletedMotionIds.length) {
      return;
    }

    const fetchMotionStates = async () => {
      setLoading(true);
      const statesMap = new Map(motionStatesMap);

      await Promise.all(
        newMotionIds.map(async (nativeMotion) => {
          const votingReputationAddress =
            votingReputationByColony[nativeMotion.colonyAddress];
          if (!votingReputationAddress) {
            return;
          }
          const votingRepClient = VotingReputationFactory.connect(
            votingReputationAddress,
            ethersProvider as unknown as Provider,
          );

          const motionStateKey = getMotionName({
            colonyAddress: nativeMotion.colonyAddress,
            motionId: nativeMotion.motionId,
          });
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
