import { Extension, Id } from '@colony/colony-js';
import React from 'react';
import { type FieldValues } from 'react-hook-form';
import { type useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { COLONY_EXTENSIONS_ROUTE } from '~routes/index.ts';
import { type TabItem } from '~shared/Extensions/Tabs/types.ts';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type OnSuccess } from '~shared/Fields/index.ts';
import {
  type AnyExtensionData,
  type ExtensionInitParam,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { type SetStateFn } from '~types/index.ts';
import { notNull } from '~utils/arrays/index.ts';
import { addressHasRoles } from '~utils/checks/index.ts';

export enum ExtensionTabId {
  OVERVIEW = 0,
  SETTINGS = 1,
}

export const waitForColonyPermissions = ({
  refetchColony,
  extensionData,
  interval = 1000,
}) =>
  new Promise<void>((res) => {
    const initTime = new Date().valueOf();
    const intervalId = setInterval(async () => {
      const fifteenSeconds = 1000 * 15;
      if (new Date().valueOf() - initTime > fifteenSeconds) {
        // after 15 seconds, assume something went wrong
        clearInterval(intervalId);
        // Not rejecting here because it's not a critical error. If the extension was enabled but permissions not, a separate warning shows
        res();
      }

      const { data: response } = (await refetchColony()) ?? {};
      const updatedColony =
        response?.getColonyByName?.items?.filter(notNull)[0];
      if (updatedColony) {
        const extensionHasPermissions = addressHasRoles({
          address: (extensionData as InstalledExtensionData).address ?? '',
          colony: updatedColony,
          requiredRoles: extensionData.neededColonyPermissions,
          requiredRolesDomain: Id.RootDomain,
        });

        if (extensionHasPermissions) {
          clearInterval(intervalId);
          res();
        }
      }
    }, interval);
  });

export const waitForDbAfterExtensionAction = ({
  refetchExtensionData,
  method,
  interval = 1000,
  latestVersion,
}: {
  refetchExtensionData: RefetchExtensionDataFn;
  interval?: number;
  method: ExtensionMethods;
  latestVersion?: number;
}) =>
  new Promise<void>((res, rej) => {
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

      let condition = false;

      switch (method) {
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
          // Extension.MultisigPermissions doesn't need initialisation by default
          condition =
            !!extension?.isInitialized || !!extension?.params?.multiSig;
          break;
        }

        case ExtensionMethods.UPGRADE: {
          condition = extension?.currentVersion === latestVersion;
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

export const getFormSuccessFn =
  <T extends FieldValues>({
    setWaitingForEnableConfirmation,
    extensionData,
    checkExtensionEnabled,
    navigate,
    colonyName,
  }: {
    setWaitingForEnableConfirmation: SetStateFn;
    extensionData: AnyExtensionData;
    checkExtensionEnabled: () => Promise<void>;
    navigate: ReturnType<typeof useNavigate>;
    colonyName: string;
  }): OnSuccess<T> =>
  async (_, { reset }) => {
    setWaitingForEnableConfirmation(true);
    try {
      await checkExtensionEnabled();
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionEnable.toast.title.success' }}
          description={{ id: 'extensionEnable.toast.description.success' }}
        />,
      );
      reset();
      navigate(
        `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionData.extensionId}`,
      );
    } catch (error) {
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionEnable.toast.title.error' }}
          description={{ id: 'extensionEnable.toast.description.error' }}
        />,
      );
    } finally {
      setWaitingForEnableConfirmation(false);
    }
  };

export const createExtensionSetupInitialValues = (
  initializationParams: ExtensionInitParam[],
) => {
  return initializationParams.reduce((initialValues, param) => {
    return {
      ...initialValues,
      [param.paramName]: param.defaultValue,
    };
  }, {});
};

export const mapExtensionActionPayload = (
  payload: Record<string, any>,
  initializationParams?: ExtensionInitParam[],
) => {
  return initializationParams?.reduce(
    (formattedPayload, { paramName, transformValue }) => {
      const paramValue = transformValue
        ? transformValue(payload[paramName])
        : payload[paramName];
      return {
        ...formattedPayload,
        [paramName]: paramValue,
      };
    },
    {},
  );
};

export const getExtensionTabs = (
  extension: Extension,
  isInstalled?: boolean,
): TabItem[] => {
  /* eslint-disable no-fallthrough */
  switch (extension) {
    case Extension.VotingReputation:
    case Extension.MultisigPermissions: {
      if (isInstalled) {
        return [
          { id: ExtensionTabId.OVERVIEW, title: 'Overview' },
          { id: ExtensionTabId.SETTINGS, title: 'Extension settings' },
        ];
      }
    }
    default:
      return [{ id: ExtensionTabId.OVERVIEW, title: 'Overview' }];
  }
  /* eslint-enable no-fallthrough */
};
