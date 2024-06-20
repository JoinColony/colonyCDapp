import { type ApolloQueryResult } from '@apollo/client';
import { getExtensionHash, type Extension } from '@colony/colony-js';
import { useMemo } from 'react';

import { supportedExtensionsConfig } from '~constants/index.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  type Exact,
  type GetColonyExtensionQuery,
  useGetColonyExtensionQuery,
  useGetCurrentExtensionVersionQuery,
} from '~gql';
import { type AnyExtensionData } from '~types/extensions.ts';
import {
  mapToInstallableExtensionData,
  mapToInstalledExtensionData,
} from '~utils/extensions.ts';

export enum ExtensionMethods {
  INSTALL = 'installExtension',
  UNINSTALL = 'uninstallExtension',
  UPGRADE = 'upgradeExtension',
  DEPRECATE = 'deprecateExtension',
  REENABLE = 'reenableExtension',
  ENABLE = 'enableExtension',
  SAVE_CHANGES = 'saveChanges',
}

export type RefetchExtensionDataFn = (
  variables?:
    | Partial<
        Exact<{
          colonyAddress: string;
          extensionHash: string;
        }>
      >
    | undefined,
) => Promise<ApolloQueryResult<GetColonyExtensionQuery>>;
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
  const { colony } = useColonyContext();

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
    fetchPolicy: 'network-only',
  });
  const colonyExtension = data?.getExtensionByColonyAndHash?.items?.[0];

  const { data: versionData, loading: versionLoading } =
    useGetCurrentExtensionVersionQuery({
      variables: {
        extensionHash,
      },
      fetchPolicy: 'cache-and-network',
    });
  const { version } = versionData?.getCurrentVersionByKey?.items?.[0] || {};

  const extensionConfig = supportedExtensionsConfig.find(
    (e) => e.extensionId === extensionId,
  );

  const extensionData = useMemo<AnyExtensionData | null>(() => {
    if (!version || !extensionConfig) {
      return null;
    }

    if (colonyExtension) {
      return mapToInstalledExtensionData({
        colony,
        extensionConfig,
        colonyExtension,
        version,
      });
    }

    return mapToInstallableExtensionData(extensionConfig, version);
  }, [colony, colonyExtension, extensionConfig, version]);

  return {
    extensionData,
    loading: extensionLoading || versionLoading,
    startPolling,
    stopPolling,
    refetchExtensionData: refetch,
  };
};

export default useExtensionData;
