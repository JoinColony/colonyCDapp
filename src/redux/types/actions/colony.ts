import { Extension } from '@colony/colony-js';
import { NavigateFunction } from 'react-router-dom';

import { ActionTypes } from '~redux/index.ts';
import {
  InstallableExtensionData,
  InstalledExtensionData,
} from '~types/extensions.ts';
import { Address, WithKey } from '~types/index.ts';

import { ActionType, ErrorActionType, UniqueActionType } from './index.ts';

export type ColonyActionTypes =
  | UniqueActionType<
      ActionTypes.CLAIM_TOKEN,
      { tokenAddresses: Address[]; colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.CLAIM_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.CLAIM_TOKEN_SUCCESS,
      { params: { tokenAddresses: Address[] } },
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
        inviteCode: string;
        tokenAvatar?: string;
        tokenThumbnail?: string;
      },
      { navigate?: NavigateFunction }
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
      {
        colonyAddress: Address;
        extensionId: Extension;
        isToDeprecate: boolean;
      },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_DEPRECATE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_DEPRECATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_UNINSTALL,
      { colonyAddress: Address; extensionId: Extension },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_UNINSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_UPGRADE,
      { colonyAddress: Address; extensionId: Extension; version: number },
      WithKey
    >
  | UniqueActionType<ActionTypes.EXTENSION_UPGRADE_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UPGRADE_ERROR, object>
  | UniqueActionType<ActionTypes.EXTENSION_UNINSTALL_SUCCESS, object, object>
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>;
