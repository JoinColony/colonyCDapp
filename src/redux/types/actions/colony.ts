import { ActionTypes } from '~redux';
import {
  Address,
  InstallableExtensionData,
  InstalledExtensionData,
  WithKey,
} from '~types';
import { ActionType, ErrorActionType, UniqueActionType } from './index';

export type ColonyActionTypes =
  | UniqueActionType<
      ActionTypes.CLAIM_TOKEN,
      { tokenAddress: Address; colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.CLAIM_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.CLAIM_TOKEN_SUCCESS,
      { params: { token: Address } },
      object
    >
  | UniqueActionType<
      ActionTypes.CREATE,
      {
        colonyName: string;
        displayName: string;
        recover: string;
        tokenAddress?: Address;
        tokenChoice: 'create' | 'select';
        tokenIcon: string;
        tokenName: string;
        tokenSymbol: string;
        username: string;
      },
      object
    >
  | ActionType<typeof ActionTypes.CREATE_CANCEL>
  | ErrorActionType<ActionTypes.CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.CREATE_SUCCESS, void, object>
  | ErrorActionType<ActionTypes.RECOVERY_MODE_ENTER_ERROR, object>
  | UniqueActionType<ActionTypes.RECOVERY_MODE_ENTER_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_INSTALL,
      { colonyAddress: Address; extensionData: InstallableExtensionData },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_INSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_INSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_ENABLE,
      {
        colonyAddress: Address;
        extensionData: InstalledExtensionData;
      },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_ENABLE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_ENABLE_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_DEPRECATE,
      { colonyAddress: Address; extensionId: string; isToDeprecate: boolean },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_DEPRECATE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_DEPRECATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_UNINSTALL,
      { colonyAddress: Address; extensionId: string },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_UNINSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_UPGRADE,
      { colonyAddress: Address; extensionId: string; version: number },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_UPGRADE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UPGRADE_ERROR, object>
  | UniqueActionType<ActionTypes.EXTENSION_UNINSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>;
