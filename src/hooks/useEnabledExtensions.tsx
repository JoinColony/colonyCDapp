import { Extension } from '@colony/colony-js';

import useExtensionsData from './useExtensionsData';

type EnabledExtensionKey = `is${Extension}Enabled`;
type EnabledExtensions = Partial<Record<EnabledExtensionKey, boolean>>;

const useEnabledExtensions = () => {
  const { installedExtensionsData, loading } = useExtensionsData();

  const enabledExtensions = installedExtensionsData.reduce<EnabledExtensions>(
    (extensions, extension) => ({
      ...extensions,
      [`is${extension.extensionId}Enabled`]: extension.isEnabled,
    }),
    {},
  );

  return {
    loading,
    enabledExtensions,
  };
};

export default useEnabledExtensions;
