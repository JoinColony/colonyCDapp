import { Extension } from '@colony/colony-js';
import React from 'react';

import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { type SetStateFn } from '~types';
import { type AnyExtensionData } from '~types/extensions.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';
import { camelCase } from '~utils/lodash.ts';
import { waitForCondition } from '~utils/waitForCondition.ts';

export const waitForDbAfterExtensionSettingsChange = async ({
  extensionData,
  refetchExtensionData,
  interval = 1000,
  timeout = 30000,
}: {
  extensionData: AnyExtensionData;
  refetchExtensionData: RefetchExtensionDataFn;
  interval?: number;
  timeout?: number;
}) => {
  await waitForCondition(
    async () => {
      const previousExtensionParams = isInstalledExtensionData(extensionData)
        ? extensionData.params || null
        : null;

      const refetchedExtensionData = await refetchExtensionData();

      const haveParamsUpdated =
        previousExtensionParams !== refetchedExtensionData?.params;

      return haveParamsUpdated;
    },
    {
      interval,
      timeout,
    },
  );
};

export const waitForDbAfterExtensionAction = async (
  args: {
    refetchExtensionData: RefetchExtensionDataFn;
    setWaitingForActionConfirmation: SetStateFn;
    interval?: number;
    timeout?: number;
  } & (
    | {
        method: ExtensionMethods.UPGRADE;
        latestVersion: number;
      }
    | {
        method: ExtensionMethods.INSTALL | ExtensionMethods.ENABLE;
        initialiseTransactionFailed?: boolean;
        setUserRolesTransactionFailed?: boolean;
      }
    | {
        method: Exclude<
          ExtensionMethods,
          | ExtensionMethods.UPGRADE
          | ExtensionMethods.INSTALL
          | ExtensionMethods.ENABLE
        >;
      }
  ),
) => {
  const {
    refetchExtensionData,
    setWaitingForActionConfirmation,
    interval = 1000,
    timeout = 30000,
    method,
  } = args;

  setWaitingForActionConfirmation(true);

  await waitForCondition(
    async () => {
      const shouldRefetchPermissions =
        method === ExtensionMethods.INSTALL ||
        method === ExtensionMethods.ENABLE;

      const extensionData = await refetchExtensionData(
        shouldRefetchPermissions,
      );

      let condition = false;

      switch (method) {
        case ExtensionMethods.INSTALL:
        case ExtensionMethods.ENABLE: {
          // If there is no extensionData, return early
          if (!extensionData) {
            condition = false;
            break;
          }

          if (
            method === ExtensionMethods.INSTALL &&
            !extensionData.autoEnableAfterInstall
          ) {
            // If it appears in the query, it means it's been installed
            condition = !!extensionData;
            break;
          }

          // If we are enabling, or autoEnableAfterInstall is true, then check for transaction failures

          if (args.initialiseTransactionFailed) {
            // If initialise failed, then continue so long as there is extensionData
            condition = !!extensionData;
            break;
          }

          if (args.setUserRolesTransactionFailed) {
            // The setUserRoles transaction always comes after the initialise transaction, so we should wait to check the extension is enabled
            // An extension is still considered enabled if it has no initialise parameters, so if there is no initialise transaction required, this will return true
            condition = !!extensionData.isEnabled;
            break;
          }

          if (extensionData.extensionId === Extension.MultisigPermissions) {
            // Wait until MultiSig params are present
            condition =
              !!extensionData.params?.multiSig &&
              !!extensionData.isEnabled &&
              extensionData.missingColonyPermissions.length === 0;
            break;
          }

          // All transactions succeeded, return true once extension is enabled and it has all permissions
          condition =
            !!extensionData.isEnabled &&
            extensionData.missingColonyPermissions.length === 0;
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

      return condition;
    },
    {
      interval,
      timeout,
    },
  );

  setWaitingForActionConfirmation(false);
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
