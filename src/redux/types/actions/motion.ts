import { type ColonyRole } from '@colony/colony-js';
import { type BigNumber } from 'ethers';

import { type NetworkInfo } from '~constants/index.ts';
import { type ExternalLink, type ColonyRoleFragment } from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';
import { type Authority } from '~types/authority.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import {
  type Expenditure,
  type Colony,
  type Domain,
  type DomainColor,
  type Safe,
  type SafeTransactionData,
} from '~types/graphql.ts';
import {
  type Address,
  type ManageVerifiedMembersOperation,
} from '~types/index.ts';
import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

import { type OneTxPaymentPayload } from './colonyActions.ts';
import {
  type ExpenditureFundPayload,
  type CancelStakedExpenditurePayload,
  type CancelExpenditurePayload,
} from './expenditures.ts';
import {
  type ErrorActionType,
  type UniqueActionType,
  type ActionTypeWithMeta,
  type MetaWithSetter,
  type UniqueActionTypeWithoutPayload,
} from './index.ts';

export enum RootMotionMethodNames {
  MintTokens = 'mintTokens',
  MoveFunds = 'moveFunds',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
}

export interface ExpenditureFundMotionPayload extends ExpenditureFundPayload {
  motionDomainId: number;
}

export type StakedExpenditureCancelMotionPayload =
  CancelStakedExpenditurePayload & {
    colonyName: string;
    motionDomainId: number;
  };

export type ExpenditureCancelMotionPayload = Omit<
  CancelExpenditurePayload,
  'colonyAddress'
> & {
  motionDomainId: number;
  votingReputationAddress: Address;
  colony: Colony;
};

export type MotionFinalizePayload = {
  associatedActionId: string;
  userAddress: Address;
  colonyAddress: Address;
  motionId: string;
  canMotionFail?: boolean;
};

export type MotionDomainCreateEditPayload = {
  colonyAddress: Address;
  isCreateDomain: boolean;
  customActionTitle: string;
  domain?: Domain;
  colonyName?: string;
  domainName: string;
  domainColor?: DomainColor;
  domainPurpose?: string;
  annotationMessage?: string;
  parentDomainId?: number;
  isMultiSig: boolean;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  domainCreatedInNativeId: number;
};
interface OneTxPaymentMotionPayload extends OneTxPaymentPayload {
  colonyDomains: Domain[];
  colonyRoles: ColonyRoleFragment[];
  isMultiSig?: boolean;
}

export type MotionActionTypes =
  | UniqueActionType<
      ActionTypes.MOTION_STAKE,
      {
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
        amount: BigNumber;
        activateTokens: boolean;
        activeAmount: string;
        tokenAddress: Address;
        actionId: string;
        associatedActionId: string;
        annotationMessage?: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_STAKE_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_STAKE_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_VOTE,
      {
        associatedActionId: string;
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_VOTE_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_VOTE_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_REVEAL_VOTE,
      {
        associatedActionId: string;
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_REVEAL_VOTE_ERROR, object>
  | UniqueActionTypeWithoutPayload<
      ActionTypes.MOTION_REVEAL_VOTE_SUCCESS,
      object
    >
  | UniqueActionType<ActionTypes.MOTION_FINALIZE, MotionFinalizePayload, object>
  | ErrorActionType<ActionTypes.MOTION_FINALIZE_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_FINALIZE_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_CLAIM,
      {
        userAddress: Address;
        colonyAddress: Address;
        extensionAddress: Address;
        transactionHash: string;
        associatedActionId: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_CLAIM_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_CLAIM_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_CLAIM_ALL,
      {
        userAddress: Address;
        colonyAddress: Address;
        extensionAddress: Address;
        userStakes: {
          databaseMotionId: string;
          colonyAddress: string;
          extensionAddress: string;
        }[];
        associatedActionId: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_CLAIM_ALL_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_CLAIM_ALL_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
      MotionDomainCreateEditPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_DOMAIN_CREATE_EDIT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_DOMAIN_CREATE_EDIT_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT,
      MotionDomainCreateEditPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<
      ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT_ERROR,
      object
    >
  | ActionTypeWithMeta<
      ActionTypes.MOTION_REPUTATION_DOMAIN_CREATE_EDIT_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT,
      MotionDomainCreateEditPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<
      ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT_ERROR,
      object
    >
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MULTISIG_DOMAIN_CREATE_EDIT_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EXPENDITURE_PAYMENT,
      OneTxPaymentMotionPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EXPENDITURE_PAYMENT_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EXPENDITURE_PAYMENT_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EDIT_COLONY,
      {
        colony: Colony;
        customActionTitle: string;
        colonyDisplayName?: string;
        colonyAvatarImage?: string;
        colonyThumbnail?: string;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        isMultiSig?: boolean;
        tokenAddresses?: Address[];
        colonyDescription?: string | null;
        colonyExternalLinks?: ExternalLink[] | null;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EDIT_COLONY_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EDIT_COLONY_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_MOVE_FUNDS,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName?: string;
        colonyVersion: number;
        tokenAddress: Address;
        fromDomain: Domain;
        toDomain: Domain;
        amount: BigNumber;
        annotationMessage?: string;
        isMultiSig?: boolean;
        colonyRoles: ColonyRoleFragment[];
        colonyDomains: Domain[];
        createdInDomain: Domain;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_MOVE_FUNDS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MOVE_FUNDS_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.ROOT_MOTION,
      {
        operationName: RootMotionMethodNames;
        customActionTitle: string;
        colonyAddress: Address;
        colonyName?: string;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        motionParams: [BigNumber] | [string];
        annotationMessage?: string;
        isMultiSig?: boolean;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.ROOT_MOTION_ERROR, object>
  | ActionTypeWithMeta<ActionTypes.ROOT_MOTION_SUCCESS, MetaWithSetter<object>>
  | UniqueActionType<
      ActionTypes.MOTION_USER_ROLES_SET,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName: string;
        domainId: number;
        userAddress: Address;
        roles: Record<ColonyRole, boolean>;
        authority: Authority;
        motionDomainId: number;
        annotationMessage?: string;
        colonyRoles: ColonyRoleFragment[];
        colonyDomains: Domain[];
        isMultiSig?: boolean;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_USER_ROLES_SET_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_USER_ROLES_SET_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_ESCALATE,
      {
        userAddress: Address;
        colonyAddress: Address;
        motionId: BigNumber;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_ESCALATE_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_ESCALATE_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_MANAGE_REPUTATION,
      {
        colonyAddress: Address;
        customActionTitle: string;
        colonyName?: string;
        domainId: number;
        userAddress: Address;
        amount: BigNumber;
        motionDomainId: number;
        annotationMessage?: string;
        isSmitingReputation?: boolean;
        isMultiSig?: boolean;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
      },
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS,
      {
        operation: ManageVerifiedMembersOperation;
        colonyAddress: Address;
        colonyName: string;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        isMultiSig?: boolean;
        members: string[];
        domainId: number;
        annotationMessage?: string;
        customActionTitle: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS_ERROR, object>
  | UniqueActionType<
      ActionTypes.MOTION_MANAGE_VERIFIED_MEMBERS_SUCCESS,
      object,
      object
    >
  | ErrorActionType<ActionTypes.MOTION_MANAGE_REPUTATION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MANAGE_REPUTATION_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EXPENDITURE_FUND,
      ExpenditureFundMotionPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EXPENDITURE_FUND_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EXPENDITURE_CANCEL,
      ExpenditureCancelMotionPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EXPENDITURE_CANCEL_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EXPENDITURE_CANCEL_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL,
      StakedExpenditureCancelMotionPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION,
      {
        safe: Omit<Safe, 'safeName'>;
        customActionTitle: string;
        transactions: SafeTransactionData[];
        colonyAddress: Address;
        colonyName: string;
        motionDomainId: string;
        annotationMessage: string | null;
        network: NetworkInfo;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES,
      {
        colonyAddress: Address;
        colonyName: string;
        expenditure: Expenditure;
        slotIds: number[];
        tokenAddresses: Address[];
        stagedExpenditureAddress: Address;
        votingReputationAddress: Address;
        motionDomainId: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        payouts: ExpenditurePayoutFieldValue[];
        networkInverseFee: string;
        annotationMessage?: string;
        motionDomainId: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_EXPENDITURE_FINALIZE,
      {
        colony: Colony;
        expenditure: Expenditure;
        votingReputationAddress: Address;
        motionDomainId: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_EXPENDITURE_FINALIZE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_EXPENDITURE_FINALIZE_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_MANAGE_TOKENS,
      {
        colonyAddress: Address;
        colonyName: string;
        tokenAddresses: Address[];
        customActionTitle: string;
        annotationMessage?: string;
        isMultiSig: boolean;
        colonyRoles: ColonyRoleFragment[];
        colonyDomains: Domain[];
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_MANAGE_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MANAGE_TOKENS_SUCCESS,
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_ARBITRARY_TRANSACTION,
      {
        customActionTitle: string;
        colonyAddress: Address;
        colonyDomains: Domain[];
        colonyRoles: ColonyRoleFragment[];
        annotationMessage?: string;
        isMultiSig?: boolean;
        transactions: AddTransactionTableModel[];
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_ARBITRARY_TRANSACTION_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_ARBITRARY_TRANSACTION_SUCCESS,
      MetaWithSetter<object>
    >;
