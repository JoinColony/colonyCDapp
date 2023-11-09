import { BigNumber } from 'ethers';
import { ColonyRole } from '@colony/colony-js';

import {
  Address,
  Colony,
  ColonyObjective,
  Domain,
  DomainColor,
  Safe,
  SafeTransactionData,
} from '~types';
import { NetworkInfo } from '~constants';

import { ActionTypes } from '../../actionTypes';

import {
  ErrorActionType,
  UniqueActionType,
  ActionTypeWithMeta,
  MetaWithSetter,
  UniqueActionTypeWithoutPayload,
} from './index';
import { ExternalLink } from '~gql';
import { OneTxPaymentPayload } from './colonyActions';
import {
  ExpenditureFundPayload,
  StakedExpenditureCancelPayload,
} from './expenditures';

export enum RootMotionMethodNames {
  MintTokens = 'mintTokens',
  Upgrade = 'upgrade',
  UnlockToken = 'unlockToken',
}

type MotionExpenditureBase = {
  fromDomainId: number;
  motionDomainId: number;
};
export type ExpenditureFundMotionPayload = Omit<
  ExpenditureFundPayload,
  'colonyAddress'
> &
  MotionExpenditureBase & {
    colony: Colony;
  };

export type StakedExpenditureCancelMotionPayload =
  StakedExpenditureCancelPayload &
    MotionExpenditureBase & { colonyName: string };

export type MotionFinalizePayload = {
  userAddress: Address;
  colonyAddress: Address;
  motionId: string;
  gasEstimate: string;
};

export type MotionActionTypes =
  | UniqueActionType<
      ActionTypes.MOTION_STAKE,
      {
        colonyAddress: Address;
        motionId: BigNumber;
        vote: number;
        amount: BigNumber;
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
        motionIds: string[];
      },
      object
    >
  | ErrorActionType<ActionTypes.MOTION_CLAIM_ALL_ERROR, object>
  | UniqueActionTypeWithoutPayload<ActionTypes.MOTION_CLAIM_ALL_SUCCESS, object>
  | UniqueActionType<
      ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
      {
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
      },
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
        tokenAddresses?: Address[];
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
        motionParams: [BigNumber] | [string];
        annotationMessage?: string;
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
    >;
