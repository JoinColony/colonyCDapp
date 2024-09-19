import { getExtensionHash } from '@colony/colony-js';

import { supportedExtensionsConfig } from '~constants';
import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { camelCase } from '~utils/lodash.ts';

export const waitForDbAfterExtensionAction = (
  args: {
    refetchExtensionData: RefetchExtensionDataFn;
    interval?: number;
  } & (
    | {
        method: ExtensionMethods.UPGRADE;
        latestVersion: number;
      }
    | {
        method: ExtensionMethods.SAVE_CHANGES;
        params: Record<string, any>;
      }
    | {
        method: Exclude<
          ExtensionMethods,
          ExtensionMethods.UPGRADE | ExtensionMethods.SAVE_CHANGES
        >;
      }
  ),
) => {
  const { refetchExtensionData, interval = 1000 } = args;

  return new Promise<void>((res, rej) => {
    const initTime = new Date().valueOf();
    const intervalId = setInterval(async () => {
      const thirtySeconds = 1000 * 30;
      if (new Date().valueOf() - initTime > thirtySeconds) {
        // after 30 seconds, assume something went wrong
        clearInterval(intervalId);
        rej(
          new Error(
            `After ${thirtySeconds} seconds, could not find extension in the database.`,
          ),
        );
      }

      const { data: freshExtensionData } = await refetchExtensionData();
      const extension =
        freshExtensionData?.getExtensionByColonyAndHash?.items[0];

      const extensionConfig = supportedExtensionsConfig.find(
        (e) => getExtensionHash(e.extensionId) === extension?.hash,
      );

      let condition = false;

      switch (args.method) {
        case ExtensionMethods.INSTALL: {
          if (extension) {
            // If it appears in the query, it means it's been installed
            condition = !!extension;
          }
          break;
        }
        case ExtensionMethods.DEPRECATE: {
          condition = !!extension?.isDeprecated;
          break;
        }
        case ExtensionMethods.REENABLE: {
          condition = !extension?.isDeprecated;
          break;
        }

        case ExtensionMethods.ENABLE: {
          condition = !!extension?.isInitialized;
          break;
        }

        case ExtensionMethods.UPGRADE: {
          condition = extension?.currentVersion === args.latestVersion;
          break;
        }

        case ExtensionMethods.SAVE_CHANGES: {
          const initializationParams =
            extensionConfig?.initializationParams || [];
          condition = Object.entries(args.params).every(([key, value]) => {
            const initializationParam = initializationParams.find(
              (param) => param.paramName === key,
            );

            if (!initializationParam) {
              return true;
            }

            const extensionParamValue =
              extension?.params?.[camelCase(extensionConfig?.extensionId)]?.[
                key
              ];

            return initializationParam.transformValue
              ? initializationParam.transformValue(value) ===
                  extensionParamValue
              : value === extensionParamValue;
          });

          break;
        }

        // Extension data is filtered by deleted, therefore if it's been deleted it won't appear in query results
        case ExtensionMethods.UNINSTALL: {
          condition = !extension;
          break;
        }

        default: {
          break;
        }
      }

      if (condition) {
        clearInterval(intervalId);
        res();
      }
    }, interval);
  });
};
