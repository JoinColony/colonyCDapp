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
import { type ColonyRole } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
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

  const colonyRoles = useMemo(
    () => extractColonyRoles(colony.roles),
    [colony.roles],
  );

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

  const extensionConfig = useMemo(
    () => supportedExtensionsConfig.find((e) => e.extensionId === extensionId),
    [extensionId],
  );

  const extensionData = useMemo<AnyExtensionData | null>(
    () =>
      getMappedExtensionData({
        colonyRoles,
        colonyExtension: rawExtensionData,
        version,
        extensionConfig,
      }),
    [colonyRoles, rawExtensionData, version, extensionConfig],
  );

  const handleRefetch = useCallback(
    async (shouldRefetchPermissions?: boolean) => {
      const refetchResponse = await refetch();
      const updatedColonyExtension =
        refetchResponse.data.getExtensionByColonyAndHash?.items[0];

      if (updatedColonyExtension) {
        let updatedColonyRoles: ColonyRole[] | null = null;
        if (shouldRefetchPermissions) {
          const colonyRefetchResponse = await refetchColony();
          const updatedColony =
            colonyRefetchResponse?.data.getColonyByName?.items?.[0];
          updatedColonyRoles = extractColonyRoles(updatedColony?.roles);
        }

        // Extension is guaranteed to be installed if returned by the query
        return getMappedExtensionData({
          colonyRoles: updatedColonyRoles ?? colonyRoles,
          colonyExtension: updatedColonyExtension,
          version,
          extensionConfig,
        }) as InstalledExtensionData;
      }

      return null;
    },
    [colonyRoles, extensionConfig, refetch, refetchColony, version],
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
