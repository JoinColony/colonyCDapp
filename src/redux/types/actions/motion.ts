import { type ColonyRole } from '@colony/colony-js';
import { type BigNumber } from 'ethers';

import { type NetworkInfo } from '~constants/index.ts';
import { type ActionTypes } from '~redux/actionTypes.ts';
import { type ColonyRoleFragment } from '~gql';
import { type Authority } from '~types/authority.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import {
  type Expenditure,
  type Colony,
  type ColonyObjective,
  type Domain,
  type DomainColor,
  type Safe,
  type SafeTransactionData,
} from '~types/graphql.ts';
import { type Address } from '~types/index.ts';

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

// eslint-disable-next-line no-warning-comments
// TODO: These method names are not specifically associated with motions
// They are the actual Contract method names so it will be better if we
// refactored it to:
//
// enum ColonyMethodNames { <<-- declare this enum somewhere else
//   MintTokens = 'mintTokens',
//   Upgrade = 'upgrade',
//   UnlockToken = 'unlockToken',
// }
//
// Then we create another enum for another Contract like
// enum StreamingPaymentsMethodNames {
//   Cancel = 'cancel'
// }
//
// Then use these enums in both motion and non-motion sagas
export enum RootMotionMethodNames {
  MintTokens = 'mintTokens',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
  EditColonyByDelta = 'editColonyByDelta',
  AddDomain = 'addDomain(uint256,uint256,uint256,string)',
  EditDomain = 'editDomain',
}

export type ExpenditureFundMotionPayload = Omit<
  ExpenditureFundPayload,
  'colonyAddress'
> & {
  fromDomainId: number;
  motionDomainId: number;
  colony: Colony;
};

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
  userAddress: Address;
  colonyAddress: Address;
  motionId: string;
  canMotionFail?: boolean;
};

export type MotionDomainCreateEditPayload = {
  colonyAddress: Address;
  isCreateDomain: boolean;
  motionDomainId: number;
  customActionTitle: string;
  domain?: Domain;
  colonyName?: string;
  domainName: string;
  domainColor?: DomainColor;
  domainPurpose?: string;
  annotationMessage?: string;
  parentId?: number;
  isMultiSig: boolean;
  colonyRoles: ColonyRoleFragment[];
  colonyDomains: Domain[];
  operationName: RootMotionMethodNames;
};

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
        actionId?: string;
        annotationMessage?: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_STAKE_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_STAKE_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_VOTE,
      {
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
      ActionTypes.MOTION_EXPENDITURE_PAYMENT,
      OneTxPaymentPayload,
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
        colonyDescription?: string | null;
        colonyExternalLinks?: ExternalLink[] | null;
        annotationMessage?: string;
        colonyObjective?: ColonyObjective;
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
        motionDomainId: string;
        annotationMessage?: string;
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
      },
      MetaWithSetter<object>
    >
  | UniqueActionType<
      ActionTypes.MOTION_ADD_VERIFIED_MEMBERS,
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
  | ErrorActionType<ActionTypes.MOTION_ADD_VERIFIED_MEMBERS_ERROR, object>
  | UniqueActionType<
      ActionTypes.MOTION_ADD_VERIFIED_MEMBERS_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS,
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
  | ErrorActionType<ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS_ERROR, object>
  | UniqueActionType<
      ActionTypes.MOTION_REMOVE_VERIFIED_MEMBERS_SUCCESS,
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
      ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE,
      {
        colonyAddress: Address;
        colonyName: string;
        expenditure: Expenditure;
        slotId: number;
        tokenAddresses: Address[];
        stagedExpenditureAddress: Address;
        motionDomainId: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGE_SUCCESS,
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
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.MOTION_MANAGE_TOKENS_ERROR, object>
  | ActionTypeWithMeta<
      ActionTypes.MOTION_MANAGE_TOKENS_SUCCESS,
      MetaWithSetter<object>
    >;
