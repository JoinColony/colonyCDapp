import { Extension } from '@colony/colony-js';
import React from 'react';

import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
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
        method: Exclude<ExtensionMethods, ExtensionMethods.UPGRADE>;
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

      const shouldRefetchPermissions =
        args.method === ExtensionMethods.INSTALL ||
        args.method === ExtensionMethods.ENABLE;
      const extensionData = await refetchExtensionData(
        shouldRefetchPermissions,
      );

      let condition = false;

      switch (args.method) {
        case ExtensionMethods.INSTALL: {
          if (extensionData?.autoEnableAfterInstall) {
            condition =
              !!extensionData.isEnabled &&
              extensionData.missingColonyPermissions.length === 0;
            break;
          }

          if (extensionData?.extensionId === Extension.MultisigPermissions) {
            // Wait until MultiSig params are present
            condition = !!extensionData.params?.multiSig;
            break;
          }

          // If it appears in the query, it means it's been installed
          condition = !!extensionData;
          break;
        }
        case ExtensionMethods.DEPRECATE: {
          condition = !!extensionData?.isDeprecated;
          break;
        }
        case ExtensionMethods.REENABLE: {
          condition = !extensionData?.isDeprecated;
          break;
        }

        case ExtensionMethods.ENABLE: {
          condition = !!extensionData?.isInitialized;
          break;
        }

        case ExtensionMethods.UPGRADE: {
          condition = extensionData?.currentVersion === args.latestVersion;
          break;
        }

        // Extension data is filtered by deleted, therefore if it's been deleted it won't appear in query results
        case ExtensionMethods.UNINSTALL: {
          condition = !extensionData;
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

export const getExtensionParams = (
  extensionData: AnyExtensionData | null,
): object => {
  if (!extensionData || !isInstalledExtensionData(extensionData)) {
    return {};
  }

  return extensionData.params?.[camelCase(extensionData.extensionId)] ?? {};
};
