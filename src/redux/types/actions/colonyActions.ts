import { type ColonyRole } from '@colony/colony-js';
import { type BigNumber } from 'ethers';
import { type RefObject } from 'react';

import { type NetworkInfo } from '~constants/index.ts';
import { type ColonyRoleFragment, type ExternalLink } from '~gql';
import { type ActionTypes } from '~redux/index.ts';
import { type Authority } from '~types/authority.ts';
import {
  type DomainColor,
  type Domain,
  type Colony,
  type Safe,
  type SafeTransactionData,
} from '~types/graphql.ts';
import {
  type Address,
  type WithKey,
  type ManageVerifiedMembersOperation,
} from '~types/index.ts';

import {
  type ErrorActionType,
  type UniqueActionType,
  type ActionTypeWithMeta,
  type MetaWithSetter,
} from './index.ts';

export type OneTxPaymentPayload = {
  colonyAddress: Address;
  domainId: number;
  customActionTitle: string;
  chainId: string;
  payments: {
    recipientAddress: string;
    amount: string;
    tokenAddress: Address;
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
        annotationMessage?: string;
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
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
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
        authority: Authority;
        annotationMessage?: string;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
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
      ActionTypes.ACTION_ADD_VERIFIED_MEMBERS,
      {
        colonyAddress: Address;
        colonyName: string;
        members: string[];
        domainId: number;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_ADD_VERIFIED_MEMBERS_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS,
      {
        colonyAddress: Address;
        colonyName: string;
        members: string[];
        domainId: number;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_REMOVE_VERIFIED_MEMBERS_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS,
      {
        operation: ManageVerifiedMembersOperation;
        colonyAddress: Address;
        colonyName: string;
        members: string[];
        domainId: number;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_MANAGE_VERIFIED_MEMBERS_SUCCESS,
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
    >
  | UniqueActionType<
      ActionTypes.ACTION_MANAGE_TOKENS,
      {
        colonyAddress: Address;
        colonyName: string;
        tokenAddresses: Address[];
        customActionTitle: string;
        annotationMessage: string | null;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MANAGE_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MANAGE_TOKENS_SUCCESS,
      MetaWithSetter<object>
    >;
