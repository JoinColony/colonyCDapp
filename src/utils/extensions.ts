import { AnyExtensionData, InstalledExtensionData } from '~types';

/**
 * Type guard to distinguish installed extension data from extension config
 */
export const isInstalledExtensionData = (
  extension: AnyExtensionData,
): extension is InstalledExtensionData =>
  (extension as InstalledExtensionData).address !== undefined;
