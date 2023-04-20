import {
  AnyExtensionData,
  ExtensionConfig,
  InstalledExtensionData,
  ColonyExtension,
  InstallableExtensionData,
} from '~types';

/**
 * Type guard to distinguish installed extension data from installable extension data
 */
export const isInstalledExtensionData = (extension: AnyExtensionData): extension is InstalledExtensionData =>
  (extension as InstalledExtensionData).address !== undefined;

export const mapToInstallableExtensionData = (
  extensionConfig: ExtensionConfig,
  version: number,
): InstallableExtensionData => {
  return {
    ...extensionConfig,
    availableVersion: version,
  };
};

export const mapToInstalledExtensionData = (
  extensionConfig: ExtensionConfig,
  colonyExtension: ColonyExtension,
  version: number,
): InstalledExtensionData => {
  // extension is also considered initialized if it has no initialization params
  const isInitialized = colonyExtension?.isInitialized || !extensionConfig.initializationParams;
  const isEnabled = isInitialized && !colonyExtension.isDeprecated;

  return {
    ...extensionConfig,
    ...colonyExtension,
    availableVersion: version,
    isInitialized,
    isEnabled,
  };
};
