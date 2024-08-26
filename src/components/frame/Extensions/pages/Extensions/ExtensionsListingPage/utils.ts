import {
  type InstallableExtensionData,
  type AnyExtensionData,
  type ExtensionConfig,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { notMaybe } from '~utils/arrays/index.ts';

export const getExtensionData = (
  items: ExtensionConfig[],
  availableExtensionsData: InstallableExtensionData[],
  installedExtensionsData: InstalledExtensionData[],
): AnyExtensionData[] =>
  items
    .map((item) => item?.extensionId)
    .filter(notMaybe)
    .reduce<AnyExtensionData[]>((acc, extensionId) => {
      let extensionData = availableExtensionsData.find(
        (extension) => extension.extensionId === extensionId,
      );

      if (!extensionData) {
        extensionData = installedExtensionsData.find(
          (extension) => extension.extensionId === extensionId,
        );
      }

      if (extensionData) {
        acc.push(extensionData);
      }

      return acc;
    }, []);
