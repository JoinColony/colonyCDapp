import { getExtensionHash } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';

import { supportedExtensionsConfig } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  useGetColonyExtensionsQuery,
  useGetCurrentExtensionsVersionsQuery,
} from '~gql';
import {
  type InstallableExtensionData,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { notNull } from '~utils/arrays/index.ts';
import {
  mapToInstallableExtensionData,
  mapToInstalledExtensionData,
} from '~utils/extensions.ts';

interface UseExtensionsDataReturn {
  installedExtensionsData: InstalledExtensionData[];
  availableExtensionsData: InstallableExtensionData[];
  loading: boolean;
  shortPollExtensions: () => void;
}

/**
 * Hook for fetching extensions data available to a colony
 * and mapping it into Installed or InstallableExtensionData object
 */
const useExtensionsData = (): UseExtensionsDataReturn => {
  const {
    colony,
    colony: { colonyAddress },
  } = useColonyContext();
  const {
    data,
    loading: extensionsLoading,
    refetch: refetchExtensions,
  } = useGetColonyExtensionsQuery({
    variables: {
      colonyAddress,
    },
    fetchPolicy: 'cache-and-network',
  });
  const colonyExtensions = data?.getColony?.extensions?.items?.filter(notNull);

  const { data: versionsData, loading: versionsLoading } =
    useGetCurrentExtensionsVersionsQuery({
      fetchPolicy: 'cache-and-network',
    });
  const extensionVersions =
    versionsData?.listCurrentVersions?.items?.filter(notNull);

  const installedExtensionsData = useMemo<InstalledExtensionData[]>(() => {
    if (!colonyExtensions) {
      return [];
    }

    const colonyExtensionsMap =
      colonyExtensions.map<InstalledExtensionData | null>((extension) => {
        const extensionConfig = supportedExtensionsConfig.find(
          (e) => getExtensionHash(e.extensionId) === extension?.hash,
        );

        const { version } =
          extensionVersions?.find((e) => e?.extensionHash === extension.hash) ||
          {};

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
  }, [colony, colonyExtensions, extensionVersions]);

  const availableExtensionsData = useMemo<InstallableExtensionData[]>(() => {
    if (!colonyExtensions) {
      return [];
    }

    return supportedExtensionsConfig.reduce<InstallableExtensionData[]>(
      (availableExtensions, extensionConfig) => {
        const extensionHash = getExtensionHash(extensionConfig.extensionId);
        const isExtensionInstalled = !!colonyExtensions.find(
          (e) => e.hash === extensionHash,
        );
        const { version } =
          extensionVersions?.find((e) => e?.extensionHash === extensionHash) ||
          {};

        // skip if extension is installed or we don't have version information
        if (isExtensionInstalled || !version) {
          return availableExtensions;
        }

        return [
          ...availableExtensions,
          mapToInstallableExtensionData(extensionConfig, version),
        ];
      },
      [],
    );
  }, [colonyExtensions, extensionVersions]);

  // Custom polling prevents start / stop poll clashing with one another in the event
  // Extensions are deprecated / reenabled in quick succession
  const shortPollExtensions = useCallback(() => {
    const interval = setInterval(refetchExtensions, 2_000);
    setTimeout(() => clearInterval(interval), 10_000);
  }, [refetchExtensions]);

  return {
    installedExtensionsData,
    availableExtensionsData,
    loading: extensionsLoading || versionsLoading,
    shortPollExtensions,
  };
};

export default useExtensionsData;
