import { type Extension } from '@colony/colony-js';
import { type NavigateFunction } from 'react-router-dom';

import { type ActionTypes } from '~redux/index.ts';
import {
  type InstallableExtensionData,
  type InstalledExtensionData,
} from '~types/extensions.ts';
import { type Address, type WithKey } from '~types/index.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

import {
  type MetaWithSetter,
  type ActionType,
  type ErrorActionType,
  type UniqueActionType,
} from './index.ts';

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
  | UniqueActionType<
      ActionTypes.FINISH_CREATE,
      {
        colonyName: string;
        tokenChoice: 'create' | 'select';
      },
      { navigate?: NavigateFunction }
    >
  | ErrorActionType<ActionTypes.FINISH_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.FINISH_CREATE_SUCCESS, void, object>
  | ErrorActionType<ActionTypes.RECOVERY_MODE_ENTER_ERROR, object>
  | UniqueActionType<ActionTypes.RECOVERY_MODE_ENTER_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXTENSION_INSTALL_AND_ENABLE,
      {
        colonyAddress: Address;
        extensionData: InstallableExtensionData;
        defaultParams?: Record<string, any>;
      },
      WithKey
    >
  | UniqueActionType<
      ActionTypes.EXTENSION_INSTALL_AND_ENABLE_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.EXTENSION_INSTALL_AND_ENABLE_ERROR, object>
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
  | ErrorActionType<ActionTypes.EXTENSION_UNINSTALL_ERROR, object>
  | UniqueActionType<
      ActionTypes.CREATE_ARBITRARY_TRANSACTION,
      {
        colonyAddress: Address;
        customActionTitle: string;
        transactions: AddTransactionTableModel[];
        annotationMessage: string | null;
      },
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.CREATE_ARBITRARY_TRANSACTION_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.CREATE_ARBITRARY_TRANSACTION_ERROR, object>;
