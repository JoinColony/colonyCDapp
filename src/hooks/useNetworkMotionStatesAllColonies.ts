import {
  getExtensionHash,
  type MotionState,
  VotingReputationFactory,
} from '@colony/colony-js';
import { Extension } from '@colony/colony-js';
import { type Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

import { supportedExtensionsConfig } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetCurrentExtensionsVersionsQuery } from '~gql';
import { notNull, notUndefined } from '~utils/arrays/index.ts';

import { mapToInstalledExtensionData } from '../utils/extensions.ts';

import useJoinedColoniesWithExtensions from './useJoinedColoniesWithExtensions.ts';

export type MotionStatesMap = Map<string, MotionState | null>;

export type MotionStatesMapByColonies = Map<string, MotionStatesMap>;

export type RefetchMotionStates = (motionIdsToRefetch?: string[]) => void;

const getInstalledExtensions = (colony, versionsData) => {
  const colonyExtensions = colony?.extensions?.items?.filter(notNull);
  if (!colonyExtensions) {
    return [];
  }

  const extensionVersions =
    versionsData?.listCurrentVersions?.items?.filter(notNull);

  const colonyExtensionsMap = colonyExtensions.map((extension) => {
    const extensionConfig = supportedExtensionsConfig.find(
      (e) => getExtensionHash(e.extensionId) === extension?.hash,
    );

    const { version } =
      extensionVersions?.find((e) => e?.extensionHash === extension.hash) || {};

    // Unsupported extension
    if (!extensionConfig || !version) {
      return null;
    }

    return mapToInstalledExtensionData({
      colony,
      extensionConfig,
      colonyExtension: extension,
      version,
    });
  });
  return colonyExtensionsMap.filter(notNull);
};

const getVotingReputationAdress = (installedExtensions): string | undefined => {
  const votingReputationExtension = installedExtensions.find(
    (extension) => extension.extensionId === Extension.VotingReputation,
  );

  return votingReputationExtension?.address;
};

/**
 * Hook that accepts an array of motion IDs and returns a map of motion IDs to their states
 * Make sure to memoize the array of motion IDs to avoid infinite loops
 */
const useNetworkMotionStatesAllColonies = (
  nativeMotionIds: string[],
  skip?: boolean,
) => {
  const { wallet } = useAppContext();
  const { joinedColoniesWithExtensions } = useJoinedColoniesWithExtensions(
    wallet?.address,
  );

  const { data: versionsData } = useGetCurrentExtensionsVersionsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const votingReputationByColony = joinedColoniesWithExtensions.reduce(
    (prev, colony) => {
      return {
        ...prev,
        [colony.colonyAddress]: getVotingReputationAdress(
          getInstalledExtensions(colony, versionsData),
        ),
      };
    },
    {},
  );

  const [loading, setLoading] = useState(false);

  const [motionStatesMapByColonies, setMotionStatesMapByColonies] =
    useState<MotionStatesMapByColonies>(new Map());

  useEffect(() => {
    const { ethersProvider } = wallet || {};

    const votingReputationAddressesCount = Object.values(
      votingReputationByColony,
    ).filter(notUndefined).length;
    if (
      skip ||
      !nativeMotionIds.length ||
      !votingReputationAddressesCount ||
      !ethersProvider
    ) {
      return;
    }

    const existingMotionIdsMap = new Map();
    motionStatesMapByColonies.forEach((value: MotionStatesMap) => {
      value.forEach((v, k) => {
        existingMotionIdsMap.set(k, v);
      });
    });

    const newMotionIds = nativeMotionIds.filter(
      (nativeMotionId) => !existingMotionIdsMap.has(nativeMotionId),
    );
    const deletedMotionIds = Array.from(existingMotionIdsMap.keys()).filter(
      (nativeMotionId) => !nativeMotionIds.includes(nativeMotionId),
    );
    if (!newMotionIds.length && !deletedMotionIds.length) {
      return;
    }

    const fetchMotionStates = async () => {
      setLoading(true);

      const statesMapByColony = new Map(motionStatesMapByColonies);

      await Promise.all(
        Object.entries(votingReputationByColony).map(
          async ([colony, votingReputationAddress]: [string, string]) => {
            if (!votingReputationAddress) {
              return;
            }
            const votingRepClient = VotingReputationFactory.connect(
              votingReputationAddress,
              ethersProvider as unknown as Provider,
            );

            const statesMap = new Map();

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

            statesMapByColony.set(colony, statesMap);
          },
        ),
      );
      setMotionStatesMapByColonies(statesMapByColony);
      setLoading(false);
    };

    fetchMotionStates();
  }, [
    motionStatesMapByColonies,
    nativeMotionIds,
    skip,
    wallet,
    votingReputationByColony,
  ]);

  return {
    motionStatesMapByColonies,
    votingReputationByColony,
    loading,
  };
};

export default useNetworkMotionStatesAllColonies;
