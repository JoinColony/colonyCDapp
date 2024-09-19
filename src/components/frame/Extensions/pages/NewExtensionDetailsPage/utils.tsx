import { Extension, getExtensionHash } from '@colony/colony-js';
import React from 'react';

import { supportedExtensionsConfig } from '~constants';
import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import {
  type AnyExtensionData,
  type ExtensionInitParam,
} from '~types/extensions.ts';
import {
  convertFractionToEth,
  isInstalledExtensionData,
} from '~utils/extensions.ts';
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

export const getTextChunks = () => {
  const HeadingChunks = (chunks: React.ReactNode[]) => (
    <h4 className="mb-4 mt-6 font-semibold text-gray-900">{chunks}</h4>
  );

  const ParagraphChunks = (chunks: React.ReactNode[]) => (
    <p className="mb-4">{chunks}</p>
  );
  const BoldChunks = (chunks: React.ReactNode[]) => (
    <b className="font-medium text-gray-900">{chunks}</b>
  );
  const ListChunks = (chunks: React.ReactNode[]) => (
    <ul className="my-4 ml-4 list-disc">{chunks}</ul>
  );
  const ListItemChunks = (chunks: React.ReactNode[]) => <li>{chunks}</li>;

  return {
    h4: HeadingChunks,
    p: ParagraphChunks,
    b: BoldChunks,
    ul: ListChunks,
    li: ListItemChunks,
  };
};

const getInitializationDefaultValues = (
  initializationParams: ExtensionInitParam[],
) => {
  return initializationParams.reduce<
    Record<string, string | number | undefined>
  >((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const getExtensionParams = (
  extensionData: AnyExtensionData | null,
): Record<string, string | number | undefined> => {
  if (!extensionData) {
    return {};
  }

  const isExtensionEnabled =
    isInstalledExtensionData(extensionData) && extensionData.isEnabled;
  const { initializationParams = [] } = extensionData;
  const defaultValues = getInitializationDefaultValues(initializationParams);

  if (isExtensionEnabled) {
    switch (extensionData.extensionId) {
      case Extension.StakedExpenditure: {
        return {
          stakeFraction: extensionData?.params?.stakedExpenditure?.stakeFraction
            ? convertFractionToEth(
                extensionData.params.stakedExpenditure.stakeFraction,
              )
            : String(defaultValues.stakeFraction),
        };
      }
      default: {
        return (
          extensionData.params?.[camelCase(extensionData.extensionId)] ?? {}
        );
      }
    }
  }

  return defaultValues;
};

export const getExtensionSettingsActionType = (
  extensionData: AnyExtensionData,
) => {
  const isExtensionInstalled = isInstalledExtensionData(extensionData);

  switch (extensionData.extensionId) {
    case Extension.StakedExpenditure: {
      if (
        isExtensionInstalled &&
        (extensionData.isEnabled || extensionData.isDeprecated)
      ) {
        return ActionTypes.SET_STAKE_FRACTION;
      }

      return ActionTypes.EXTENSION_ENABLE;
    }
    default: {
      return ActionTypes.EXTENSION_ENABLE;
    }
  }
};
