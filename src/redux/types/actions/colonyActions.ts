import { RefObject } from 'react';
import { BigNumber } from 'ethers';
import { ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '~redux';
import {
  Address,
  WithKey,
  DomainColor,
  Domain,
  Colony,
  ColonyObjective,
  Safe,
  SafeTransactionData,
} from '~types';
import { NetworkInfo } from '~constants';
import { ExternalLink } from '~gql';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithSetter,
} from './index';

export type OneTxPaymentPayload = {
  colonyAddress: Address;
  domainId: number;
  customActionTitle: string;
  payments: {
    recipient: string;
    amount: string;
    tokenAddress: Address;
    decimals: number;
  }[];
  annotationMessage?: string;
  motionDomainId?: number;
  colonyName?: string;
};
/*
 * @NOTE About naming
 * I couldn't come up with anything better, as we already have ColonyActionTypes :(
 */
export type ColonyActionsActionTypes =
  | UniqueActionType<
      ActionTypes.ACTION_DOMAIN_CREATE,
      {
        customActionTitle: string;
        colonyAddress: Address;
        colonyName: string;
        domainName: string;
        domainColor: DomainColor;
        domainPurpose: string;
        annotationMessage?: string;
        parentId?: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_DOMAIN_CREATE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_DOMAIN_EDIT,
      {
        colonyAddress: Address;
        colonyName?: string;
        domain: Domain;
        customActionTitle: string;
        domainName?: string;
        domainColor?: DomainColor;
        domainPurpose?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_DOMAIN_EDIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_EXPENDITURE_PAYMENT,
      OneTxPaymentPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_EDIT_COLONY,
      {
        colony: Colony;
        customActionTitle: string;
        colonyDisplayName?: string;
        colonyDescription?: string | null;
        colonyExternalLinks?: ExternalLink[] | null;
        colonyAvatarImage?: string;
        colonyThumbnail?: string;
        tokenAddresses?: Address[];
        annotationMessage?: string;
        colonyObjective?: ColonyObjective;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_EDIT_COLONY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_EDIT_COLONY_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName?: string;
        tokenAddress: Address;
        fromDomain: Domain;
        toDomain: Domain;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MINT_TOKENS,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName?: string;
        nativeTokenAddress: Address;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MINT_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MINT_TOKENS_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_VERSION_UPGRADE,
      {
        colonyAddress: Address;
        customActionTitle: string;
        version: string;
        colonyName?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ActionTypeWithMeta<
      ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_VERSION_UPGRADE_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_USER_ROLES_SET,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        roles: Record<ColonyRole, boolean>;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_USER_ROLES_SET_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_UNLOCK_TOKEN,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ActionTypeWithMeta<
      ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_UNLOCK_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY,
      {
        colonyAddress: Address;
        customActionTitle: string;
        walletAddress: Address;
        colonyName: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_RECOVERY_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_SET_SLOT,
      {
        colonyAddress: Address;
        customActionTitle: string;
        walletAddress: Address;
        startBlock: number;
        storageSlotLocation: string;
        storageSlotValue: string;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_SET_SLOT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_RECOVERY_SET_SLOT_SUCCESS,
      Record<string, unknown>
    >
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_APPROVE,
      {
        colonyAddress: Address;
        customActionTitle: string;
        walletAddress: Address;
        startBlock: number;
        scrollToRef: RefObject<HTMLInputElement>;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_APPROVE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_RECOVERY_APPROVE_SUCCESS,
      Record<string, unknown>
    >
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_EXIT,
      {
        colonyAddress: Address;
        customActionTitle: string;
        startBlock: number;
        scrollToRef: RefObject<HTMLInputElement>;
      },
      WithKey
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_EXIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_RECOVERY_EXIT_SUCCESS,
      Record<string, unknown>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MANAGE_REPUTATION,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        amount: BigNumber;
        isSmitingReputation?: boolean;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MANAGE_REPUTATION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE,
      {
        colony: Colony;
        colonyDisplayName: string;
        verifiedAddresses: Address[];
        colonyTokenAddresses: Address[];
        customActionTitle: string;
        annotationMessage?: string;
        isWhitelistActivated: boolean;
        removedAddresses: Address[];
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.ACTION_MANAGE_EXISTING_SAFES,
      {
        colony: Colony;
        customActionTitle: string;
        safes: Safe[];
        annotationMessage?: string;
        isRemovingSafes?: boolean;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MANAGE_EXISTING_SAFES_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MANAGE_EXISTING_SAFES_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION,
      {
        safe: Omit<Safe, 'safeName'>;
        transactions: SafeTransactionData[];
        colonyAddress: Address;
        customActionTitle: string;
        colonyName: string;
        annotationMessage: string | null;
        network: NetworkInfo;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      MetaWithSetter<object>
    >;
