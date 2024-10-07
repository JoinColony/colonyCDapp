import { Extension, Id } from '@colony/colony-js';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

import { getUserRolesForDomain } from '~transformers/index.ts';
import {
  type AnyExtensionData,
  type ExtensionConfig,
  type InstalledExtensionData,
  type InstallableExtensionData,
} from '~types/extensions.ts';
import { type Colony, type ColonyExtension } from '~types/graphql.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

import { userHasRole } from './checks/index.ts';

const DEFAULT_STAKE_PERCENTAGE = 1; // 1%

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

export const mapToInstalledExtensionData = ({
  colony,
  extensionConfig,
  colonyExtension,
  version,
}: {
  colony: Colony;
  extensionConfig: ExtensionConfig;
  colonyExtension: ColonyExtension;
  version: number;
}): InstalledExtensionData => {
  // extension is also considered initialized if it has no initialization params
  const isInitialized =
    colonyExtension?.isInitialized || !extensionConfig.initializationParams;
  const isEnabled = isInitialized && !colonyExtension.isDeprecated;

  const extensionRoles = getUserRolesForDomain({
    colonyRoles: extractColonyRoles(colony.roles),
    userAddress: colonyExtension.address,
    domainId: Id.RootDomain,
  });
  const missingPermissions = extensionConfig.neededColonyPermissions.filter(
    (neededRole) => {
      return !userHasRole(extensionRoles, neededRole);
    },
  );

  return {
    ...extensionConfig,
    ...colonyExtension,
    availableVersion: version,
    isInitialized,
    isEnabled,
    missingColonyPermissions: missingPermissions,
  };
};

export const getMappedExtensionData = ({
  colony,
  colonyExtension,
  version,
  extensionConfig,
}: {
  colony: Colony;
  colonyExtension?: ColonyExtension | null;
  version?: number;
  extensionConfig?: ExtensionConfig;
}): AnyExtensionData | null => {
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
};

export const canExtensionBeInitialized = (extension: Extension) => {
  switch (extension) {
    case Extension.OneTxPayment: {
      return false;
    }

    default: {
      return true;
    }
  }
};
/**
 * For extensions accepting fraction parameter that the user enters as a percentage
 * while the contracts require the value to be in wei. This function converts the
 * percentage to wei.
 */
export const convertFractionToWei = (percentage: number) =>
  new Decimal(percentage).mul(new Decimal(10).pow(16)).toString();

export const getDefaultStakeFraction = (nativeTokensDecimals: number) =>
  BigNumber.from(10)
    .pow(nativeTokensDecimals)
    .mul(DEFAULT_STAKE_PERCENTAGE)
    .div(100);

export const convertFractionToEth = (value: string) =>
  new Decimal(value).div(new Decimal(10).pow(16)).toString();

/**
 * For extensions accepting period parameter that the user enters in hours,
 * this function converts it to seconds.
 */
export const convertPeriodToSeconds = (periodInHours: number) =>
  new Decimal(periodInHours)
    .mul(3600)
    .toFixed(0, Decimal.ROUND_HALF_UP)
    .toString();

/**
 * This function converts seconds to hours.
 */
export const convertPeriodToHours = (periodInSeconds: string) =>
  new Decimal(periodInSeconds)
    .div(3600)
    .toDecimalPlaces(4, Decimal.ROUND_HALF_UP)
    .toString();
