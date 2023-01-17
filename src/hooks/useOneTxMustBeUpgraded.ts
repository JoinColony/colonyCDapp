import { getExtensionHash } from '@colony/colony-js';
import { InstalledExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';
import { useGetCurrentExtensionVersionQuery } from '~gql';

export const useOneTxMustBeUpgraded = (
  extensionData: InstalledExtensionData,
) => {
  const extensionHash = extensionData
    ? getExtensionHash(extensionData?.extensionId)
    : '';

  const { data: versionData } = useGetCurrentExtensionVersionQuery({
    variables: {
      extensionHash,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { version } = versionData?.getCurrentVersionByItem?.items?.[0] || {};

  return version &&
    extensionData?.currentVersion &&
    isInstalledExtensionData(extensionData)
    ? extensionData.currentVersion < version
    : false;
};

export default useOneTxMustBeUpgraded;
