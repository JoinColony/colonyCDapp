import { RefObject } from 'react';
import { BigNumber } from 'ethers';
import { ColonyRole } from '@colony/colony-js';

import { ActionTypes } from '~redux';
import { Address, WithKey, DomainColor, Domain, Colony } from '~types';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithHistory,
  MetaWithNavigate,
} from './index';

/*
 * @NOTE About naming
 * I couldn't come up with anything better, as we already have ColonyActionTypes :(
 */
export type ColonyActionsActionTypes =
  | UniqueActionType<
      ActionTypes.ACTION_DOMAIN_CREATE,
      {
        colonyAddress: Address;
        colonyName?: string;
        domainName: string;
        domainColor: DomainColor;
        domainPurpose: string;
        annotationMessage?: string;
        parentId?: number;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_DOMAIN_CREATE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_DOMAIN_CREATE_SUCCESS,
      MetaWithNavigate<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_DOMAIN_EDIT,
      {
        colonyAddress: Address;
        colonyName?: string;
        domain: Domain;
        domainName?: string;
        domainColor?: DomainColor;
        domainPurpose?: string;
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_DOMAIN_EDIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_DOMAIN_EDIT_SUCCESS,
      MetaWithNavigate<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_EXPENDITURE_PAYMENT,
      {
        colonyAddress: Address;
        colonyName?: string;
        recipientAddress: Address;
        domainId: number;
        singlePayment: {
          amount: BigNumber;
          tokenAddress: Address;
          decimals: number;
        };
        annotationMessage?: string;
        walletAddress: Address;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithNavigate<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_EDIT_COLONY,
      {
        colony: Colony;
        colonyDisplayName?: string;
        colonyAvatarImage?: string;
        hasAvatarChanged?: boolean;
        colonyTokens?: Address[];
        verifiedAddresses?: Address[];
        isWhitelistActivated?: boolean;
        annotationMessage?: string;
        /*
         * @TODO I think this will also store the subscribed-to tokens list
         */
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_EDIT_COLONY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_EDIT_COLONY_SUCCESS,
      MetaWithNavigate<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        colonyName?: string;
        tokenAddress: Address;
        fromDomain: Domain;
        toDomain: Domain;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MOVE_FUNDS_SUCCESS,
      MetaWithNavigate<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_MINT_TOKENS,
      {
        colonyAddress: Address;
        colonyName?: string;
        nativeTokenAddress: Address;
        amount: BigNumber;
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MINT_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MINT_TOKENS_SUCCESS,
      MetaWithNavigate<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_VERSION_UPGRADE,
      {
        colonyAddress: Address;
        version: string;
        colonyName?: string;
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ActionTypeWithMeta<
      ActionTypes.ACTION_VERSION_UPGRADE_SUCCESS,
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_VERSION_UPGRADE_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_USER_ROLES_SET,
      {
        colonyAddress: Address;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        roles: Record<ColonyRole, boolean>;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_USER_ROLES_SET_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_UNLOCK_TOKEN,
      {
        colonyAddress: Address;
        colonyName: string;
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ActionTypeWithMeta<
      ActionTypes.ACTION_UNLOCK_TOKEN_SUCCESS,
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_UNLOCK_TOKEN_ERROR, object>
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY,
      {
        colonyAddress: Address;
        walletAddress: Address;
        colonyName: string;
        annotationMessage?: string;
      },
      MetaWithHistory<object>
    >
  | ErrorActionType<ActionTypes.ACTION_RECOVERY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_RECOVERY_SUCCESS,
      MetaWithHistory<object>
    >
  | UniqueActionType<
      ActionTypes.ACTION_RECOVERY_SET_SLOT,
      {
        colonyAddress: Address;
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
        colonyName: string;
        domainId: number;
        userAddress: Address;
        amount: BigNumber;
        isSmitingReputation?: boolean;
        annotationMessage?: string;
      },
      MetaWithNavigate<object>
    >
  | ErrorActionType<ActionTypes.ACTION_MANAGE_REPUTATION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.ACTION_MANAGE_REPUTATION_SUCCESS,
      MetaWithNavigate<object>
    >;
