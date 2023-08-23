import Decimal from 'decimal.js';

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

/**
 * For extensions accepting fraction parameter that the user enters as a percentage
 * while the contracts require the value to be in wei. This function converts the
 * percentage to wei.
 */
export const convertFractionToWei = (percentage: number) =>
  new Decimal(percentage).mul(new Decimal(10).pow(16)).toString();

/**
 * For extensions accepting period parameter that the user enters in hours,
 * this function converts it to seconds.
 */
export const convertPeriodToSeconds = (periodInHours: number) =>
  new Decimal(periodInHours)
    .mul(3600)
    .toFixed(0, Decimal.ROUND_HALF_UP)
    .toString();
