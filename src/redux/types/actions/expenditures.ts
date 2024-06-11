import { type BigNumber } from 'ethers';

import {
  type ColonyRoleFragment,
  type SplitPaymentDistributionType,
  type StreamingPaymentEndCondition,
} from '~gql';
import { type ActionTypes } from '~redux/actionTypes.ts';
import {
  type ExpenditurePayoutWithSlotId,
  type ExpenditurePayoutFieldValue,
  type ExpenditureStageFieldValue,
} from '~types/expenditures.ts';
import {
  type StreamingPayment,
  type Domain,
  type Expenditure,
} from '~types/graphql.ts';
import { type Address } from '~types/index.ts';

import {
  type UniqueActionType,
  type ErrorActionType,
  type MetaWithSetter,
} from './index.ts';

export type ExpenditureFundPayload = {
  colonyAddress: Address;
  fromDomainFundingPotId: number;
  expenditure: Expenditure;
  colonyDomains: Domain[];
  colonyRoles: ColonyRoleFragment[];
  annotationMessage?: string;
};

export type CancelStreamingPaymentPayload = {
  colonyAddress: Address;
  streamingPayment: StreamingPayment;
  annotationMessage?: string;
  userAddress: Address;
};

export type CancelAndWaitveStreamingPaymentPayload = {
  colonyAddress: Address;
  streamingPayment: StreamingPayment;
};

export type CancelStakedExpenditurePayload = {
  colonyAddress: Address;
  stakedExpenditureAddress: string;
  shouldPunish: boolean;
  expenditure: Expenditure;
  annotationMessage?: string;
};

export type CancelExpenditurePayload = {
  colonyAddress: Address;
  expenditure: Expenditure;
  stakedExpenditureAddress?: Address;
  annotationMessage?: string;
  userAddress: Address;
};

export type ExpendituresActionTypes =
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CREATE,
      {
        colonyAddress: Address;
        payouts: ExpenditurePayoutFieldValue[];
        // id of the domain to fund the expenditure from
        fundFromDomainId: number;
        isStaged?: boolean;
        stages?: ExpenditureStageFieldValue[];
        networkInverseFee: string;
        annotationMessage?: string;
        customActionTitle?: string;
        distributionType?: SplitPaymentDistributionType;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CREATE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_LOCK,
      {
        colonyAddress: Address;
        nativeExpenditureId: number;
        associatedActionId: string;
      },
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_LOCK_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_LOCK_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FINALIZE,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        userAddress: Address;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FINALIZE_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FINALIZE_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_FUND,
      ExpenditureFundPayload,
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_FUND_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_FUND_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_EDIT,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        payouts: ExpenditurePayoutFieldValue[];
        networkInverseFee: string;
        annotationMessage?: string;
        userAddress: Address;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_EDIT_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_EDIT_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CANCEL,
      CancelExpenditurePayload,
      object
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CANCEL_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CANCEL_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.EXPENDITURE_CLAIM,
      {
        associatedActionId: string;
        colonyAddress: Address;
        nativeExpenditureId: number;
        claimablePayouts: ExpenditurePayoutWithSlotId[];
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.EXPENDITURE_CLAIM_ERROR, object>
  | UniqueActionType<ActionTypes.EXPENDITURE_CLAIM_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CREATE,
      {
        colonyAddress: Address;
        payouts: ExpenditurePayoutFieldValue[];
        // the domain to create the expenditure in
        createdInDomain: Domain;
        // id of the domain to fund the expenditure from
        fundFromDomainId: number;
        stakeAmount: BigNumber;
        stakedExpenditureAddress: Address;
        isStaged?: boolean;
        stages?: ExpenditureStageFieldValue[];
        networkInverseFee: string;
        annotationMessage?: string;
        distributionType?: SplitPaymentDistributionType;
        activeBalance: string | undefined;
        tokenAddress: string;
        customActionTitle?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STAKED_EXPENDITURE_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CREATE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.RECLAIM_EXPENDITURE_STAKE,
      {
        associatedActionId: string;
        colonyAddress: Address;
        nativeExpenditureId: number;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR, object>
  | UniqueActionType<
      ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGES,
      {
        colonyAddress: Address;
        expenditure: Expenditure;
        slotIds: number[];
        /**
         * Addresses of all tokens present in the slots to be released
         * This should be refactored if more control is needed over switch tokens are claimed
         * per individual slots
         */
        tokenAddresses: Address[];
        stagedExpenditureAddress: Address;
        annotationMessage?: string;
        userAddress: Address;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.RELEASE_EXPENDITURE_STAGES_ERROR, object>
  | UniqueActionType<
      ActionTypes.RELEASE_EXPENDITURE_STAGES_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CANCEL,
      CancelStakedExpenditurePayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR, object>
  | UniqueActionType<
      ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CREATE,
      {
        colonyAddress: Address;
        createdInDomain: Domain;
        recipientAddress: Address;
        tokenAddress: Address;
        tokenDecimals: number;
        amount: string;
        startTimestamp: number;
        endTimestamp?: number;
        interval: number;
        endCondition: StreamingPaymentEndCondition;
        limitAmount?: string;
        annotationMessage?: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STREAMING_PAYMENT_CREATE_ERROR, object>
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CREATE_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.SET_STAKE_FRACTION,
      {
        colonyAddress: Address;
        stakeFraction: string;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.SET_STAKE_FRACTION_ERROR, object>
  | UniqueActionType<ActionTypes.SET_STAKE_FRACTION_SUCCESS, object, object>
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CANCEL,
      CancelStreamingPaymentPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STREAMING_PAYMENT_CANCEL_ERROR, object>
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CANCEL_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CLAIM,
      {
        colonyAddress: Address;
        streamingPaymentsAddress: Address;
        streamingPayment: StreamingPayment;
      },
      MetaWithSetter<object>
    >
  | ErrorActionType<ActionTypes.STREAMING_PAYMENT_CLAIM_ERROR, object>
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CLAIM_SUCCESS,
      object,
      object
    >
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE,
      CancelAndWaitveStreamingPaymentPayload,
      MetaWithSetter<object>
    >
  | ErrorActionType<
      ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE_ERROR,
      object
    >
  | UniqueActionType<
      ActionTypes.STREAMING_PAYMENT_CANCEL_AND_WAIVE_SUCCESS,
      object,
      object
    >;
