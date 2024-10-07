import { getExtensionHash, type Extension } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';

import { supportedExtensionsConfig } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  useGetColonyExtensionQuery,
  useGetCurrentExtensionVersionQuery,
} from '~gql';
import {
  type InstalledExtensionData,
  type AnyExtensionData,
} from '~types/extensions.ts';
import { type Colony } from '~types/graphql.ts';
import { getMappedExtensionData } from '~utils/extensions.ts';

export enum ExtensionMethods {
  INSTALL = 'installExtension',
  UNINSTALL = 'uninstallExtension',
  UPGRADE = 'upgradeExtension',
  DEPRECATE = 'deprecateExtension',
  REENABLE = 'reenableExtension',
  ENABLE = 'enableExtension',
}

export type RefetchExtensionDataFn = (
  shouldRefetchPermissions?: boolean,
) => Promise<InstalledExtensionData | null>;

interface UseExtensionDataReturn {
  extensionData: AnyExtensionData | null;
  loading: boolean;
  startPolling: (interval: number) => void;
  stopPolling: () => void;
  refetchExtensionData: RefetchExtensionDataFn;
}

/**
 * Hook for fetching extension data with a given extensionId
 * and mapping it into Installed or InstallableExtensionData object
 */
const useExtensionData = (extensionId: string): UseExtensionDataReturn => {
  const { colony, refetchColony } = useColonyContext();

  const extensionHash = getExtensionHash(extensionId as Extension);

  const {
    data,
    loading: extensionLoading,
    startPolling,
    stopPolling,
    refetch,
  } = useGetColonyExtensionQuery({
    variables: {
      colonyAddress: colony.colonyAddress,
      extensionHash,
    },
  });
  const rawExtensionData = data?.getExtensionByColonyAndHash?.items?.[0];

  const { data: versionData, loading: versionLoading } =
    useGetCurrentExtensionVersionQuery({
      variables: {
        extensionHash,
      },
    });
  const { version } = versionData?.getCurrentVersionByKey?.items?.[0] || {};

  const extensionConfig = supportedExtensionsConfig.find(
    (e) => e.extensionId === extensionId,
  );

  const extensionData = useMemo<AnyExtensionData | null>(
    () =>
      getMappedExtensionData({
        colony,
        colonyExtension: rawExtensionData,
        version,
        extensionConfig,
      }),
    [colony, rawExtensionData, version, extensionConfig],
  );

  const handleRefetch = useCallback(
    async (shouldRefetchPermissions?: boolean) => {
      const refetchResponse = await refetch();
      const updatedColonyExtension =
        refetchResponse.data.getExtensionByColonyAndHash?.items[0];

      if (updatedColonyExtension) {
        let updatedColony: Colony | null = null;
        if (shouldRefetchPermissions) {
          const colonyRefetchResponse = await refetchColony();
          updatedColony =
            colonyRefetchResponse?.data.getColonyByName?.items?.[0] ?? null;
        }

        // Extension is guaranteed to be installed if returned by the query
        return getMappedExtensionData({
          colony: updatedColony ?? colony,
          colonyExtension: updatedColonyExtension,
          version,
          extensionConfig,
        }) as InstalledExtensionData;
      }

      return null;
    },
    [colony, extensionConfig, refetch, refetchColony, version],
  );

  return {
    extensionData,
    loading: extensionLoading || versionLoading,
    startPolling,
    stopPolling,
    refetchExtensionData: handleRefetch,
  };
};

export default useExtensionData;
