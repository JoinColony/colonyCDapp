import { Extension, ONE_TX_PAYMENT_VERSION_LATEST } from '@colony/colony-js';
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
export const isInstalledExtensionData = (
  extension: AnyExtensionData,
): extension is InstalledExtensionData =>
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
  const isInitialized =
    colonyExtension?.isInitialized || !extensionConfig.initializationParams;
  const isEnabled = isInitialized && !colonyExtension.isDeprecated;

  return {
    ...extensionConfig,
    ...colonyExtension,
    availableVersion: version,
    isInitialized,
    isEnabled,
  };
};

export const oneTxMustBeUpgraded = (extensionData?: InstalledExtensionData) => {
  if (extensionData) {
    const { extensionId: extensionName, currentVersion } = extensionData;
    return (
      // @TODO temporarily using the extension version from colony-js
      // this should be replaced with the version from the DB once #163 is merged
      extensionName === Extension.OneTxPayment &&
      currentVersion < ONE_TX_PAYMENT_VERSION_LATEST
    );
  }
  return false;
};
