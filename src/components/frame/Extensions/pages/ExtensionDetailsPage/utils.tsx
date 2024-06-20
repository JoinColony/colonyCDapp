import { Extension, Id, getExtensionHash } from '@colony/colony-js';
import React from 'react';
import { type FieldValues } from 'react-hook-form';
import { type useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { supportedExtensionsConfig } from '~constants/index.ts';
import { type RefetchColonyFn } from '~context/ColonyContext/ColonyContext.ts';
import {
  ExtensionMethods,
  type RefetchExtensionDataFn,
} from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import { COLONY_EXTENSIONS_ROUTE } from '~routes/index.ts';
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
import {
  convertFractionToEth,
  isInstalledExtensionData,
} from '~utils/extensions.ts';
import { camelCase } from '~utils/lodash.ts';

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

export const getFormSuccessFn =
  <T extends FieldValues>({
    setWaitingForActionConfirmation,
    extensionData,
    refetchColony,
    refetchExtensionData,
    navigate,
    colonyName,
  }: {
    setWaitingForActionConfirmation: SetStateFn;
    extensionData: AnyExtensionData;
    refetchColony: RefetchColonyFn;
    refetchExtensionData: RefetchExtensionDataFn;
    navigate: ReturnType<typeof useNavigate>;
    colonyName: string;
  }): OnSuccess<T> =>
  async (fieldValues, { reset }) => {
    setWaitingForActionConfirmation(true);
    const isSaveChanges =
      extensionData &&
      isInstalledExtensionData(extensionData) &&
      extensionData.enabledAutomaticallyAfterInstall &&
      (extensionData.isEnabled || extensionData.isDeprecated);

    try {
      /* Wait for permissions first, so that the permissions warning doesn't flash in the ui */
      await waitForColonyPermissions({ extensionData, refetchColony });
      if (isSaveChanges) {
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.SAVE_CHANGES,
          refetchExtensionData,
          params: fieldValues.params,
        });
      } else {
        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.ENABLE,
          refetchExtensionData,
        });

        reset();

        navigate(
          `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionData.extensionId}`,
        );
      }

      toast.success(
        <Toast
          type="success"
          title={{
            id: isSaveChanges
              ? 'extensionSaveChanges.toast.title.success'
              : 'extensionEnable.toast.title.success',
          }}
          description={{
            id: isSaveChanges
              ? 'extensionSaveChanges.toast.description.success'
              : 'extensionEnable.toast.description.success',
          }}
        />,
      );
    } catch (error) {
      toast.error(
        <Toast
          type="error"
          title={{
            id: isSaveChanges
              ? 'extensionSaveChanges.toast.title.error'
              : 'extensionEnable.toast.title.error',
          }}
          description={{
            id: isSaveChanges
              ? 'extensionSaveChanges.toast.description.error'
              : 'extensionEnable.toast.description.error',
          }}
        />,
      );
    } finally {
      setWaitingForActionConfirmation(false);
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

export const getExtensionParams = (extensionData: AnyExtensionData | null) => {
  if (!extensionData) {
    return {};
  }

  const isExtensionInstalled = isInstalledExtensionData(extensionData);
  const { initializationParams = [] } = extensionData;
  const initialValues = createExtensionSetupInitialValues(initializationParams);

  if (isExtensionInstalled) {
    switch (extensionData.extensionId) {
      case Extension.StakedExpenditure: {
        return extensionData.params?.stakedExpenditure?.stakeFraction
          ? {
              stakeFraction: convertFractionToEth(
                extensionData.params.stakedExpenditure.stakeFraction,
              ),
            }
          : initialValues;
      }
      default: {
        return extensionData.params?.[camelCase(extensionData.extensionId)];
      }
    }
  }

  return initialValues;
};

export const getActionData = (extensionData: AnyExtensionData) => {
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
